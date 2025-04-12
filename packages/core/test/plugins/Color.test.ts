/**
 * Tests for the Color plugin
 */

import Color from '../../src/plugins/Color'
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

describe('Color plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with color input', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: '#ff0000' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Color({ a: '#ff0000', c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the color input was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'input',
                                className: 'mb-1',
                                defaultValue: '#ff0000',
                                type: 'color',
                        })
                )
        })

        it('should handle RGB color objects', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: { r: 1, g: 0, b: 0 } },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Color({ a: { r: 1, g: 0, b: 0 }, c, k: 'test' } as any)

                // Check that the color input was created with the correct hex value
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                defaultValue: '#ff0000',
                                type: 'color',
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
                        current: { test: '#ff0000' },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Color({ a: '#ff0000', c, k: 'test' } as any)

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

        it('should update the color when the input changes', () => {
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
                        current: { test: '#ff0000' },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Color({ a: '#ff0000', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Set the value property
                Object.defineProperty(mockInput, 'value', {
                        value: '#00ff00',
                        configurable: true,
                })

                // Simulate the change event
                mockInput.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new color
                expect(c.set).toHaveBeenCalledWith('test', '#00ff00')
        })

        it('should convert hex to RGB when the input changes and the current value is RGB', () => {
                // Create mock elements
                const mockInput = createMockElement('input') as HTMLInputElement

                // Mock the create function to return the mock input for the input element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'input') {
                                return mockInput
                        }
                        return tag
                })

                // Create a mock ctrl object with RGB color
                const c = {
                        id: 'test-id',
                        current: { test: { r: 1, g: 0, b: 0 } },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Color({ a: { r: 1, g: 0, b: 0 }, c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Set the value property to green
                Object.defineProperty(mockInput, 'value', {
                        value: '#00ff00',
                        configurable: true,
                })

                // Simulate the change event
                mockInput.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new RGB color
                expect(c.set).toHaveBeenCalledWith('test', {
                        r: 0,
                        g: 1,
                        b: 0,
                })
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
                        current: { test: '#ff0000' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Color({ a: '#ff0000', c, k: 'test' } as any)

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

                // Call the run function with a new color
                runFn('test', '#00ff00')

                // Check that the input's value property was updated
                expect(mockInput.value).toBe('#00ff00')
        })

        it('should convert RGB to hex when running with RGB color', () => {
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
                        current: { test: { r: 1, g: 0, b: 0 } },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Color({ a: { r: 1, g: 0, b: 0 }, c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Get the run function
                const runFn = addSpy.mock.calls[0][0] as (
                        key: string,
                        value: any
                ) => void

                // Call the run function with a new RGB color
                runFn('test', { r: 0, g: 1, b: 0 })

                // Check that the input's value property was updated to the hex equivalent
                expect(mockInput.value).toBe('#00ff00')
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
                        current: { test: '#ff0000' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Color({ a: '#ff0000', c, k: 'test' } as any)

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
