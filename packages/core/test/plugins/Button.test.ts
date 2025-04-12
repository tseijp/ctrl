/**
 * Tests for the Button plugin
 */

import Button from '../../src/plugins/Button'
import { ctrl } from '../../src/helpers/ctrl'
import { createMockElement } from '../utils/test-utils'

// Mock the ctrl.create function
const mockCreate = jest.fn()
const originalCreate = ctrl.create
beforeAll(() => {
        ctrl.create = mockCreate
})

afterAll(() => {
        ctrl.create = originalCreate
})

describe('Button plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a button element', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: () => {} },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Button({ a: () => {}, c, k: 'test' } as any)

                // Check that the button was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'button',
                        expect.objectContaining({
                                id: 'test-id.test',
                                className: expect.stringContaining('button'),
                        }),
                        expect.anything()
                )
        })

        it('should add click event listener to the button', () => {
                // Create mock elements
                const mockButton = createMockElement('button')
                const mockAddEventListener = jest.spyOn(
                        mockButton,
                        'addEventListener'
                )

                // Mock the create function to return the mock button
                mockCreate.mockImplementation((tag) => {
                        if (tag === 'button') {
                                return mockButton
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: jest.fn() },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Button({ a: () => {}, c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'button'
                )[1].ref

                // Call the ref function with the mock button
                refFn(mockButton)

                // Check that the event listener was added
                expect(mockAddEventListener).toHaveBeenCalledWith(
                        'click',
                        expect.any(Function)
                )
        })

        it('should call the action function when clicked', () => {
                // Create mock elements
                const mockButton = createMockElement('button')

                // Mock the create function to return the mock button
                mockCreate.mockImplementation((tag) => {
                        if (tag === 'button') {
                                return mockButton
                        }
                        return tag
                })

                // Create a mock action function
                const mockAction = jest.fn()

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: mockAction },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Button({ a: mockAction, c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'button'
                )[1].ref

                // Call the ref function with the mock button
                refFn(mockButton)

                // Simulate a click event
                mockButton.dispatchEvent(new Event('click'))

                // Check that the action function was called
                expect(mockAction).toHaveBeenCalled()
        })

        it('should support custom label text', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: () => {} },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with a custom label
                Button({
                        a: () => {},
                        c,
                        k: 'test',
                        label: 'Custom Button',
                } as any)

                // Check that the button was created with the custom label
                expect(mockCreate).toHaveBeenCalledWith(
                        'button',
                        expect.any(Object),
                        'Custom Button'
                )
        })

        it('should support custom className', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: () => {} },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with a custom className
                Button({
                        a: () => {},
                        c,
                        k: 'test',
                        className: 'custom-button',
                } as any)

                // Check that the button was created with the custom className
                expect(mockCreate).toHaveBeenCalledWith(
                        'button',
                        expect.objectContaining({
                                className: expect.stringContaining(
                                        'custom-button'
                                ),
                        }),
                        expect.anything()
                )
        })

        it('should clean up event listeners when unmounted', () => {
                // Create mock elements
                const mockButton = createMockElement('button')
                const mockRemoveEventListener = jest.spyOn(
                        mockButton,
                        'removeEventListener'
                )

                // Mock the create function to return the mock button
                mockCreate.mockImplementation((tag) => {
                        if (tag === 'button') {
                                return mockButton
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: () => {} },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Button({ a: () => {}, c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'button'
                )[1].ref

                // Call the ref function with the mock button
                refFn(mockButton)

                // Get the cleanup function
                const cleanupFn = c.cache.test

                // Call the cleanup function
                cleanupFn()

                // Check that the event listener was removed
                expect(mockRemoveEventListener).toHaveBeenCalledWith(
                        'click',
                        expect.any(Function)
                )
        })
})
