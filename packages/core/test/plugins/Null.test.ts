/**
 * Tests for the Null plugin
 */

import Null from '../../src/plugins/Null'
import { ctrl } from '../../src/helpers/ctrl'

// Mock the ctrl.create function
const mockCreate = jest.fn()
const originalCreate = ctrl.create
beforeAll(() => {
        ctrl.create = mockCreate
})

afterAll(() => {
        ctrl.create = originalCreate
})

describe('Null plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with a message for null values', () => {
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
                Null({ a: null, c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything()
                )

                // Check that a message was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'div',
                        expect.objectContaining({
                                className: expect.stringContaining('null'),
                        }),
                        expect.stringContaining('null')
                )
        })

        it('should support custom message', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom message
                Null({
                        a: null,
                        c,
                        k: 'test',
                        message: 'No value available',
                } as any)

                // Check that the custom message was used
                expect(mockCreate).toHaveBeenCalledWith(
                        'div',
                        expect.any(Object),
                        'No value available'
                )
        })

        it('should support custom className', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom className
                Null({
                        a: null,
                        c,
                        k: 'test',
                        className: 'custom-null',
                } as any)

                // Check that the div was created with the custom className
                expect(mockCreate).toHaveBeenCalledWith(
                        'div',
                        expect.objectContaining({
                                className: expect.stringContaining(
                                        'custom-null'
                                ),
                        }),
                        expect.anything()
                )
        })

        it('should handle undefined values', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: undefined },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with undefined value
                Null({ a: undefined, c, k: 'test' } as any)

                // Check that the message indicates undefined
                expect(mockCreate).toHaveBeenCalledWith(
                        'div',
                        expect.any(Object),
                        expect.stringContaining('undefined')
                )
        })

        it('should handle custom styles', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom style
                Null({
                        a: null,
                        c,
                        k: 'test',
                        style: { color: 'red', fontStyle: 'italic' },
                } as any)

                // Check that the div was created with the custom style
                expect(mockCreate).toHaveBeenCalledWith(
                        'div',
                        expect.objectContaining({
                                style: expect.objectContaining({
                                        color: 'red',
                                        fontStyle: 'italic',
                                }),
                        }),
                        expect.anything()
                )
        })

        it('should not add any run function to writes', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: null },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Null({ a: null, c, k: 'test' } as any)

                // Check that no function was added to writes
                expect(addSpy).not.toHaveBeenCalled()
        })
})
