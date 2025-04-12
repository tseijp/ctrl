/**
 * Tests for the Vector plugin
 */

import Vector from '../../../src/plugins/num/Vector'
import { ctrl } from '../../../src/helpers/ctrl'
import { createMockElement } from '../../utils/test-utils'

// Mock the ctrl.create function
const mockCreate = jest.fn()
const originalCreate = ctrl.create
beforeAll(() => {
        ctrl.create = mockCreate
})

afterAll(() => {
        ctrl.create = originalCreate
})

describe('Vector plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with inputs for each dimension', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: [1, 2, 3] },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Vector({ a: [1, 2, 3], c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that inputs were created for each dimension
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'x',
                                defaultValue: '1',
                                type: 'number',
                        })
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'y',
                                defaultValue: '2',
                                type: 'number',
                        })
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'z',
                                defaultValue: '3',
                                type: 'number',
                        })
                )
        })

        it('should handle vector objects', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: { x: 1, y: 2, z: 3 } },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Vector({ a: { x: 1, y: 2, z: 3 }, c, k: 'test' } as any)

                // Check that inputs were created for each dimension
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'x',
                                defaultValue: '1',
                                type: 'number',
                        })
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'y',
                                defaultValue: '2',
                                type: 'number',
                        })
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'z',
                                defaultValue: '3',
                                type: 'number',
                        })
                )
        })

        it('should add event listeners to the input elements', () => {
                // Create mock elements
                const mockInputX = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputY = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputZ = createMockElement(
                        'input'
                ) as HTMLInputElement

                const mockAddEventListenerX = jest.spyOn(
                        mockInputX,
                        'addEventListener'
                )
                const mockAddEventListenerY = jest.spyOn(
                        mockInputY,
                        'addEventListener'
                )
                const mockAddEventListenerZ = jest.spyOn(
                        mockInputZ,
                        'addEventListener'
                )

                // Mock the create function to return the mock inputs
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'x') {
                                return mockInputX
                        }
                        if (props && props.key === 'y') {
                                return mockInputY
                        }
                        if (props && props.key === 'z') {
                                return mockInputZ
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: [1, 2, 3] },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Vector({ a: [1, 2, 3], c, k: 'test' } as any)

                // Get the ref functions
                const refFnX = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'x'
                )[1].ref
                const refFnY = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'y'
                )[1].ref
                const refFnZ = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'z'
                )[1].ref

                // Call the ref functions with the mock inputs
                refFnX(mockInputX)
                refFnY(mockInputY)
                refFnZ(mockInputZ)

                // Check that the event listeners were added
                expect(mockAddEventListenerX).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )
                expect(mockAddEventListenerY).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )
                expect(mockAddEventListenerZ).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )
        })

        it('should update the vector when an input changes', () => {
                // Create mock elements
                const mockInputX = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputY = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputZ = createMockElement(
                        'input'
                ) as HTMLInputElement

                // Mock the create function to return the mock inputs
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'x') {
                                return mockInputX
                        }
                        if (props && props.key === 'y') {
                                return mockInputY
                        }
                        if (props && props.key === 'z') {
                                return mockInputZ
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: [1, 2, 3] },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Vector({ a: [1, 2, 3], c, k: 'test' } as any)

                // Get the ref functions
                const refFnX = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'x'
                )[1].ref
                const refFnY = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'y'
                )[1].ref
                const refFnZ = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'z'
                )[1].ref

                // Call the ref functions with the mock inputs
                refFnX(mockInputX)
                refFnY(mockInputY)
                refFnZ(mockInputZ)

                // Set the value properties
                Object.defineProperty(mockInputX, 'value', {
                        value: '10',
                        configurable: true,
                })
                Object.defineProperty(mockInputY, 'value', {
                        value: '20',
                        configurable: true,
                })
                Object.defineProperty(mockInputZ, 'value', {
                        value: '30',
                        configurable: true,
                })

                // Simulate the change event for X input
                mockInputX.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new vector
                expect(c.set).toHaveBeenCalledWith('test', [10, 2, 3])

                // Reset the mock
                jest.clearAllMocks()

                // Simulate the change event for Y input
                mockInputY.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new vector
                expect(c.set).toHaveBeenCalledWith('test', [10, 20, 3])

                // Reset the mock
                jest.clearAllMocks()

                // Simulate the change event for Z input
                mockInputZ.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new vector
                expect(c.set).toHaveBeenCalledWith('test', [10, 20, 30])
        })

        it('should add run functions to writes', () => {
                // Create mock elements
                const mockInputX = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputY = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputZ = createMockElement(
                        'input'
                ) as HTMLInputElement

                // Mock the create function to return the mock inputs
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'x') {
                                return mockInputX
                        }
                        if (props && props.key === 'y') {
                                return mockInputY
                        }
                        if (props && props.key === 'z') {
                                return mockInputZ
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: [1, 2, 3] },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Vector({ a: [1, 2, 3], c, k: 'test' } as any)

                // Get the ref functions
                const refFnX = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'x'
                )[1].ref
                const refFnY = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'y'
                )[1].ref
                const refFnZ = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'z'
                )[1].ref

                // Call the ref functions with the mock inputs
                refFnX(mockInputX)
                refFnY(mockInputY)
                refFnZ(mockInputZ)

                // Check that functions were added to writes
                expect(addSpy).toHaveBeenCalledTimes(1)

                // Get the run function
                const runFn = addSpy.mock.calls[0][0] as (
                        key: string,
                        value: number[]
                ) => void

                // Call the run function with a new vector
                runFn('test', [10, 20, 30])

                // Check that the input values were updated
                expect(mockInputX.value).toBe('10')
                expect(mockInputY.value).toBe('20')
                expect(mockInputZ.value).toBe('30')
        })

        it('should clean up event listeners when unmounted', () => {
                // Create mock elements
                const mockInputX = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputY = createMockElement(
                        'input'
                ) as HTMLInputElement
                const mockInputZ = createMockElement(
                        'input'
                ) as HTMLInputElement

                const mockRemoveEventListenerX = jest.spyOn(
                        mockInputX,
                        'removeEventListener'
                )
                const mockRemoveEventListenerY = jest.spyOn(
                        mockInputY,
                        'removeEventListener'
                )
                const mockRemoveEventListenerZ = jest.spyOn(
                        mockInputZ,
                        'removeEventListener'
                )

                // Mock the create function to return the mock inputs
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'x') {
                                return mockInputX
                        }
                        if (props && props.key === 'y') {
                                return mockInputY
                        }
                        if (props && props.key === 'z') {
                                return mockInputZ
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: [1, 2, 3] },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Vector({ a: [1, 2, 3], c, k: 'test' } as any)

                // Get the ref functions
                const refFnX = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'x'
                )[1].ref
                const refFnY = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'y'
                )[1].ref
                const refFnZ = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'z'
                )[1].ref

                // Call the ref functions with the mock inputs
                refFnX(mockInputX)
                refFnY(mockInputY)
                refFnZ(mockInputZ)

                // Get the cleanup function
                const cleanupFn = c.cache.test

                // Call the cleanup function
                cleanupFn()

                // Check that the event listeners were removed
                expect(mockRemoveEventListenerX).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )
                expect(mockRemoveEventListenerY).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )
                expect(mockRemoveEventListenerZ).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )

                // Check that the run function was removed from writes
                expect(deleteSpy).toHaveBeenCalledWith(expect.any(Function))
        })
})
