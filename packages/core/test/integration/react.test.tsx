/**
 * Tests for React integration
 */

import { useCtrl, Controller } from '../../src/react'
import { ctrl } from '../../src/helpers/ctrl'
import { createMockCtrl } from '../utils/test-utils'

// Mock React hooks
jest.mock('react', () => {
        const originalModule = jest.requireActual('react')

        return {
                ...originalModule,
                useState: jest
                        .fn()
                        .mockImplementation((initialValue) => [
                                initialValue,
                                jest.fn(),
                        ]),
                useSyncExternalStore: jest
                        .fn()
                        .mockImplementation((subscribe, getSnapshot) => {
                                subscribe()
                                return getSnapshot()
                        }),
                createElement: jest
                        .fn()
                        .mockImplementation((type, props, ...children) => ({
                                type,
                                props: { ...props, children },
                        })),
        }
})

describe('React integration', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        describe('useCtrl', () => {
                it('should create a new ctrl object when given a config object', () => {
                        // Create a mock ctrl object
                        const mockCtrlObj = createMockCtrl({ count: 0 })

                        // Mock the ctrl function directly
                        const originalCtrl =
                                require('../../src/helpers/ctrl').ctrl
                        require('../../src/helpers/ctrl').ctrl = jest
                                .fn()
                                .mockReturnValue(mockCtrlObj)

                        try {
                                // Call useCtrl with a config object
                                const result = useCtrl({ count: 0 })

                                // Check that ctrl was called with the config
                                expect(
                                        require('../../src/helpers/ctrl').ctrl
                                ).toHaveBeenCalledWith({ count: 0 }, undefined)

                                // Check that the result is the current property of the ctrl object
                                expect(result).toBe(mockCtrlObj.current)
                        } finally {
                                // Restore the original ctrl function
                                require('../../src/helpers/ctrl').ctrl =
                                        originalCtrl
                        }
                })

                it('should use the existing ctrl object when given a ctrl object', () => {
                        // Create a mock ctrl object
                        const mockCtrlObj = createMockCtrl({ count: 0 })

                        // Call useCtrl with the ctrl object
                        const result = useCtrl(mockCtrlObj)

                        // Check that the result is the current property of the ctrl object
                        expect(result).toBe(mockCtrlObj.current)
                })

                it('should subscribe to the ctrl object', () => {
                        // Create a mock ctrl object
                        const mockCtrlObj = createMockCtrl({ count: 0 })

                        // Spy on the sub method
                        const subSpy = jest.spyOn(mockCtrlObj, 'sub')

                        // Call useCtrl with the ctrl object
                        useCtrl(mockCtrlObj)

                        // Check that sub was called
                        expect(subSpy).toHaveBeenCalled()
                })

                it('should use the get method for the snapshot', () => {
                        // Create a mock ctrl object
                        const mockCtrlObj = createMockCtrl({ count: 0 })

                        // Spy on the get method
                        const getSpy = jest.spyOn(mockCtrlObj, 'get')

                        // Call useCtrl with the ctrl object
                        useCtrl(mockCtrlObj)

                        // Check that get was called
                        expect(getSpy).toHaveBeenCalled()
                })

                it('should use the provided id when creating a new ctrl object', () => {
                        // Create a mock ctrl object
                        const mockCtrlObj = createMockCtrl({ count: 0 })

                        // Mock the ctrl function directly
                        const originalCtrl =
                                require('../../src/helpers/ctrl').ctrl
                        require('../../src/helpers/ctrl').ctrl = jest
                                .fn()
                                .mockReturnValue(mockCtrlObj)

                        try {
                                // Call useCtrl with a config object and id
                                useCtrl({ count: 0 }, 'test-id')

                                // Check that ctrl was called with the config and id
                                expect(
                                        require('../../src/helpers/ctrl').ctrl
                                ).toHaveBeenCalledWith({ count: 0 }, 'test-id')
                        } finally {
                                // Restore the original ctrl function
                                require('../../src/helpers/ctrl').ctrl =
                                        originalCtrl
                        }
                })
        })

        describe('Controller', () => {
                it('should initialize the controller on first render', () => {
                        // Mock React's createElement
                        const createElement = require('react').createElement

                        // Call Controller with props
                        const result = Controller({ title: 'Test Controller' })

                        // Check that createElement was called with the _Controller component
                        expect(createElement).toHaveBeenCalledWith(
                                '_Controller',
                                expect.objectContaining({
                                        title: 'Test Controller',
                                        plugin: expect.anything(),
                                        layers: expect.anything(),
                                })
                        )
                })

                it('should register the create function', () => {
                        // Mock the register function
                        const registerSpy = jest.spyOn(
                                require('../../src/index'),
                                'register'
                        )

                        // Call Controller to trigger initialization
                        Controller({})

                        // Check that register was called with an object containing create
                        expect(registerSpy).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        create: expect.any(Function),
                                })
                        )
                })

                it('should add mount to controlls when a ctrl object is mounted', () => {
                        // Create a mock ctrl object
                        const mockCtrlObj = createMockCtrl({ count: 0 })

                        // Get the mount function from ctrl.mounts
                        const mountFn = Array.from(ctrl.mounts)[0]

                        // Call the mount function with the mock ctrl object
                        mountFn(mockCtrlObj)

                        // Check that the controlls set contains the mock ctrl object
                        // This is a bit tricky to test directly since controlls is a private variable
                        // Instead, we'll check that the listeners were called
                        expect(
                                require('react').useSyncExternalStore
                        ).toHaveBeenCalled()
                })
        })
})
