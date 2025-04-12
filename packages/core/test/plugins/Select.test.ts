/**
 * Tests for the Select plugin
 */

import Select from '../../src/plugins/Select'
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

describe('Select plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with select element and options', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'option1' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with options
                Select({
                        a: 'option1',
                        c,
                        k: 'test',
                        options: ['option1', 'option2', 'option3'],
                } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the select element was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'select',
                        expect.objectContaining({
                                key: 'select',
                                className: expect.stringContaining('select'),
                        })
                )

                // Check that the options were created
                expect(mockCreate).toHaveBeenCalledWith(
                        'option',
                        expect.objectContaining({
                                value: 'option1',
                                selected: true,
                        }),
                        'option1'
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'option',
                        expect.objectContaining({
                                value: 'option2',
                                selected: false,
                        }),
                        'option2'
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'option',
                        expect.objectContaining({
                                value: 'option3',
                                selected: false,
                        }),
                        'option3'
                )
        })

        it('should support object options with label and value', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'value1' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with object options
                Select({
                        a: 'value1',
                        c,
                        k: 'test',
                        options: [
                                { label: 'Option 1', value: 'value1' },
                                { label: 'Option 2', value: 'value2' },
                                { label: 'Option 3', value: 'value3' },
                        ],
                } as any)

                // Check that the options were created with correct labels and values
                expect(mockCreate).toHaveBeenCalledWith(
                        'option',
                        expect.objectContaining({
                                value: 'value1',
                                selected: true,
                        }),
                        'Option 1'
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'option',
                        expect.objectContaining({
                                value: 'value2',
                                selected: false,
                        }),
                        'Option 2'
                )

                expect(mockCreate).toHaveBeenCalledWith(
                        'option',
                        expect.objectContaining({
                                value: 'value3',
                                selected: false,
                        }),
                        'Option 3'
                )
        })

        it('should add change event listener to the select element', () => {
                // Create mock elements
                const mockSelect = createMockElement(
                        'select'
                ) as HTMLSelectElement
                const mockAddEventListener = jest.spyOn(
                        mockSelect,
                        'addEventListener'
                )

                // Mock the create function to return the mock select for the select element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'select') {
                                return mockSelect
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'option1' },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Select({
                        a: 'option1',
                        c,
                        k: 'test',
                        options: ['option1', 'option2', 'option3'],
                } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'select'
                )[1].ref

                // Call the ref function with the mock select
                refFn(mockSelect)

                // Check that the event listener was added
                expect(mockAddEventListener).toHaveBeenCalledWith(
                        'change',
                        expect.any(Function)
                )
        })

        it('should update the value when the select changes', () => {
                // Create mock elements
                const mockSelect = createMockElement(
                        'select'
                ) as HTMLSelectElement

                // Mock the create function to return the mock select for the select element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'select') {
                                return mockSelect
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'option1' },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Select({
                        a: 'option1',
                        c,
                        k: 'test',
                        options: ['option1', 'option2', 'option3'],
                } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'select'
                )[1].ref

                // Call the ref function with the mock select
                refFn(mockSelect)

                // Set the value property
                Object.defineProperty(mockSelect, 'value', {
                        value: 'option2',
                        configurable: true,
                })

                // Simulate the change event
                mockSelect.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new value
                expect(c.set).toHaveBeenCalledWith('test', 'option2')
        })

        it('should add a run function to writes', () => {
                // Create mock elements
                const mockSelect = createMockElement(
                        'select'
                ) as HTMLSelectElement

                // Mock the create function to return the mock select for the select element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'select') {
                                return mockSelect
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'option1' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Select({
                        a: 'option1',
                        c,
                        k: 'test',
                        options: ['option1', 'option2', 'option3'],
                } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'select'
                )[1].ref

                // Call the ref function with the mock select
                refFn(mockSelect)

                // Check that a function was added to writes
                expect(addSpy).toHaveBeenCalledWith(expect.any(Function))

                // Get the run function
                const runFn = addSpy.mock.calls[0][0] as (
                        key: string,
                        value: string
                ) => void

                // Call the run function with a new value
                runFn('test', 'option3')

                // Check that the select's value property was updated
                expect(mockSelect.value).toBe('option3')
        })

        it('should clean up event listeners when unmounted', () => {
                // Create mock elements
                const mockSelect = createMockElement(
                        'select'
                ) as HTMLSelectElement
                const mockRemoveEventListener = jest.spyOn(
                        mockSelect,
                        'removeEventListener'
                )

                // Mock the create function to return the mock select for the select element
                mockCreate.mockImplementation((tag, props) => {
                        if (props && props.key === 'select') {
                                return mockSelect
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'option1' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Select({
                        a: 'option1',
                        c,
                        k: 'test',
                        options: ['option1', 'option2', 'option3'],
                } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'select'
                )[1].ref

                // Call the ref function with the mock select
                refFn(mockSelect)

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
