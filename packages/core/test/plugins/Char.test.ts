/**
 * Tests for the Char plugin
 */

import Char from '../../src/plugins/Char'
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

describe('Char plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with input element', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'Hello World' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Char({ a: 'Hello World', c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the input element was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'input',
                                defaultValue: 'Hello World',
                                className: expect.stringContaining('input'),
                                type: 'text',
                        })
                )
        })

        it('should support placeholder option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: '' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with placeholder option
                Char({
                        a: '',
                        c,
                        k: 'test',
                        placeholder: 'Enter text here',
                } as any)

                // Check that the input was created with placeholder attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                placeholder: 'Enter text here',
                        }),
                        expect.anything()
                )
        })

        it('should support maxLength option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'Hello' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with maxLength option
                Char({
                        a: 'Hello',
                        c,
                        k: 'test',
                        maxLength: 10,
                } as any)

                // Check that the input was created with maxLength attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                maxLength: 10,
                        }),
                        expect.anything()
                )
        })

        it('should support pattern option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'abc123' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with pattern option
                Char({
                        a: 'abc123',
                        c,
                        k: 'test',
                        pattern: '[a-z0-9]+',
                } as any)

                // Check that the input was created with pattern attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                pattern: '[a-z0-9]+',
                        }),
                        expect.anything()
                )
        })

        it('should support custom className', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'Hello World' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom className
                Char({
                        a: 'Hello World',
                        c,
                        k: 'test',
                        className: 'custom-input',
                } as any)

                // Check that the input was created with the custom className
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                className: expect.stringContaining(
                                        'custom-input'
                                ),
                        }),
                        expect.anything()
                )
        })

        it('should add input event listener to the input element', () => {
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
                        current: { test: 'Hello World' },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Char({ a: 'Hello World', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Check that the event listener was added
                expect(mockAddEventListener).toHaveBeenCalledWith(
                        'input',
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
                        current: { test: 'Hello World' },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Char({ a: 'Hello World', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Set the value property
                Object.defineProperty(mockInput, 'value', {
                        value: 'New Text',
                        configurable: true,
                })

                // Simulate the input event
                mockInput.dispatchEvent(new Event('input'))

                // Check that the set method was called with the new value
                expect(c.set).toHaveBeenCalledWith('test', 'New Text')
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
                        current: { test: 'Hello World' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Char({ a: 'Hello World', c, k: 'test' } as any)

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
                        value: string
                ) => void

                // Call the run function with a new value
                runFn('test', 'New Text')

                // Check that the input's value property was updated
                expect(mockInput.value).toBe('New Text')
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
                        current: { test: 'Hello World' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Char({ a: 'Hello World', c, k: 'test' } as any)

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
                        'input',
                        expect.any(Function)
                )

                // Check that the run function was removed from writes
                expect(deleteSpy).toHaveBeenCalledWith(expect.any(Function))
        })
})
