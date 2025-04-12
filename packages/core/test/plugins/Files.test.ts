/**
 * Tests for the Files plugin
 */

import Files from '../../src/plugins/Files'
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

describe('Files plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with file input', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Files({ a: null, c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the file input was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                key: 'input',
                                type: 'file',
                                className: expect.stringContaining('file'),
                        })
                )
        })

        it('should support multiple file selection', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with multiple option
                Files({
                        a: null,
                        c,
                        k: 'test',
                        multiple: true,
                } as any)

                // Check that the file input was created with multiple attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                multiple: true,
                        }),
                        expect.anything()
                )
        })

        it('should support accept attribute for file types', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with accept option
                Files({
                        a: null,
                        c,
                        k: 'test',
                        accept: 'image/*',
                } as any)

                // Check that the file input was created with accept attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'input',
                        expect.objectContaining({
                                accept: 'image/*',
                        }),
                        expect.anything()
                )
        })

        it('should add change event listener to the input element', () => {
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
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Files({ a: null, c, k: 'test' } as any)

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

        it('should update the value when files are selected', () => {
                // Create mock elements
                const mockInput = createMockElement('input') as HTMLInputElement

                // Create mock files
                const mockFile = new File(['test content'], 'test.txt', {
                        type: 'text/plain',
                })
                const mockFileList = {
                        0: mockFile,
                        length: 1,
                        item: (index: number) =>
                                index === 0 ? mockFile : null,
                        [Symbol.iterator]: function* () {
                                yield mockFile
                        },
                } as unknown as FileList

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
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin
                Files({ a: null, c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Set the files property
                Object.defineProperty(mockInput, 'files', {
                        value: mockFileList,
                        configurable: true,
                })

                // Simulate the change event
                mockInput.dispatchEvent(new Event('change'))

                // Check that the set method was called with the new file
                expect(c.set).toHaveBeenCalledWith('test', mockFile)
        })

        it('should handle multiple files selection', () => {
                // Create mock elements
                const mockInput = createMockElement('input') as HTMLInputElement

                // Create mock files
                const mockFile1 = new File(['test content 1'], 'test1.txt', {
                        type: 'text/plain',
                })
                const mockFile2 = new File(['test content 2'], 'test2.txt', {
                        type: 'text/plain',
                })
                const mockFileList = {
                        0: mockFile1,
                        1: mockFile2,
                        length: 2,
                        item: (index: number) =>
                                index === 0
                                        ? mockFile1
                                        : index === 1
                                        ? mockFile2
                                        : null,
                        [Symbol.iterator]: function* () {
                                yield mockFile1
                                yield mockFile2
                        },
                } as unknown as FileList

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
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                        set: jest.fn(),
                } as any

                // Call the plugin with multiple option
                Files({
                        a: null,
                        c,
                        k: 'test',
                        multiple: true,
                } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[1] && call[1].key === 'input'
                )[1].ref

                // Call the ref function with the mock input
                refFn(mockInput)

                // Set the files property
                Object.defineProperty(mockInput, 'files', {
                        value: mockFileList,
                        configurable: true,
                })

                // Simulate the change event
                mockInput.dispatchEvent(new Event('change'))

                // Check that the set method was called with the array of files
                expect(c.set).toHaveBeenCalledWith('test', [
                        mockFile1,
                        mockFile2,
                ])
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
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Files({ a: null, c, k: 'test' } as any)

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
        })
})
