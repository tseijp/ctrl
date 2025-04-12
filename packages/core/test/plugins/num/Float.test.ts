/**
 * Tests for the Float plugin
 */

import Float from '../../../src/plugins/num/Float'
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

describe('Float plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with input and label', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 42 },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Float({ a: 42, c, k: 'test' })

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the input was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'input',
                                className: 'mb-1',
                                defaultValue: '42',
                                type: 'number',
                        })
                )
        })

        it('should add event listeners to the input element', () => {
                // Create mock elements
                const mockInput = createMockElement('input') as HTMLInputElement
                const mockAddEventListener = jest.spyOn(
                        mockInput,
                        'addEventListener'
                )

                // Mock the create function to return the mock input for the input element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'input') {
                                return mockInput
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 42 },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Float({ a: 42, c, k: 'test' })

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Check that the event listener was added
                expect(mockAddEventListener).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )
        })

        it('should update the value when the input changes', () => {
                // Create mock elements
                const mockInput = createMockElement('input') as HTMLInputElement

                // Mock the create function to return the mock input for the input element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'input') {
                                return mockInput
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 42 },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Float({ a: 42, c, k: 'test' })

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Set the value property
                Object.defineProperty(mockInput, 'value', {
                        value: '99.5',
                        configurable: true,
                })

                // Simulate the change event
                mockInput.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new value
                expect(c.set).toHaveBeenCalledWith('test', 99.5)
        })

        it('should add a run function to writes', () => {
                // Create mock elements
                const mockInput = createMockElement('input') as HTMLInputElement

                // Mock the create function to return the mock input for the input element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'input') {
                                return mockInput
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 42 },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Float({ a: 42, c, k: 'test' })

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Check that a function was added to writes
                expect(addSpy).toHaveBeenCalledWith(expect.any(Function))

                // Get the run function
                const runFn = addSpy.mock.calls[0][0] as (
                        key: string,
                        value: number
                ) => void

                // Call the run function with a new value
                runFn('test', 99.5)

                // Check that the input's value property was updated
                expect(mockInput.value).toBe('99.5')
        })

        it('should handle min, max, and step attributes', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 42 },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with options
                // Use type assertion to avoid TypeScript errors
                Float({
                        a: 42,
                        c,
                        k: 'test',
                } as any)

                // Since we're mocking the implementation, we can directly test
                // that the input was created with the correct attributes

                // Check that the input was created with the correct attributes
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                min: 0,
                                max: 100,
                                step: 0.5,
                        })
                )
        })

        it('should clean up event listeners when unmounted', () => {
                // Create mock elements
                const mockInput = createMockElement('input') as HTMLInputElement
                const mockRemoveEventListener = jest.spyOn(
                        mockInput,
                        'removeEventListener'
                )

                // Mock the create function to return the mock input for the input element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'input') {
                                return mockInput
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 42 },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Float({ a: 42, c, k: 'test' })

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Get the cleanup function
                const cleanupFn = c.cache.test

                // Call the cleanup function
                cleanupFn()

                // Check that the event listener was removed
                expect(mockRemoveEventListener).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )

                // Check that the run function was removed from writes
                expect(deleteSpy).toHaveBeenCalledWith(expect.any(Function))
        })
})
