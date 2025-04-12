/**
 * Tests for the Nested plugin
 */

import Nested from '../../src/plugins/Nested'
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

describe('Nested plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with nested controls', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: {
                                test: {
                                        name: 'Test Name',
                                        age: 30,
                                },
                        },
                        writes: new Set(),
                        cache: {},
                } as any

                // Create mock plugins
                const mockStringPlugin = jest.fn()
                const mockNumberPlugin = jest.fn()

                // Call the plugin with nested schema
                Nested({
                        a: { name: 'Test Name', age: 30 },
                        c,
                        k: 'test',
                        schema: {
                                name: mockStringPlugin,
                                age: mockNumberPlugin,
                        },
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

                // Check that the string plugin was called
                expect(mockStringPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 'Test Name',
                                k: 'name',
                        })
                )

                // Check that the number plugin was called
                expect(mockNumberPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 30,
                                k: 'age',
                        })
                )
        })

        it('should handle nested objects with dot notation', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: {
                                test: {
                                        user: {
                                                name: 'Test Name',
                                                profile: {
                                                        age: 30,
                                                },
                                        },
                                },
                        },
                        writes: new Set(),
                        cache: {},
                } as any

                // Create mock plugins
                const mockStringPlugin = jest.fn()
                const mockNumberPlugin = jest.fn()

                // Call the plugin with nested schema using dot notation
                Nested({
                        a: {
                                user: {
                                        name: 'Test Name',
                                        profile: {
                                                age: 30,
                                        },
                                },
                        },
                        c,
                        k: 'test',
                        schema: {
                                'user.name': mockStringPlugin,
                                'user.profile.age': mockNumberPlugin,
                        },
                } as any)

                // Check that the string plugin was called with the correct path
                expect(mockStringPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 'Test Name',
                                k: 'user.name',
                        })
                )

                // Check that the number plugin was called with the correct path
                expect(mockNumberPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 30,
                                k: 'user.profile.age',
                        })
                )
        })

        it('should handle arrays in nested objects', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: {
                                test: {
                                        items: [
                                                { id: 1, name: 'Item 1' },
                                                { id: 2, name: 'Item 2' },
                                        ],
                                },
                        },
                        writes: new Set(),
                        cache: {},
                } as any

                // Create mock plugins
                const mockStringPlugin = jest.fn()
                const mockNumberPlugin = jest.fn()

                // Call the plugin with nested schema containing arrays
                Nested({
                        a: {
                                items: [
                                        { id: 1, name: 'Item 1' },
                                        { id: 2, name: 'Item 2' },
                                ],
                        },
                        c,
                        k: 'test',
                        schema: {
                                'items.0.id': mockNumberPlugin,
                                'items.0.name': mockStringPlugin,
                                'items.1.id': mockNumberPlugin,
                                'items.1.name': mockStringPlugin,
                        },
                } as any)

                // Check that the plugins were called with the correct paths
                expect(mockNumberPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 1,
                                k: 'items.0.id',
                        })
                )

                expect(mockStringPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 'Item 1',
                                k: 'items.0.name',
                        })
                )

                expect(mockNumberPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 2,
                                k: 'items.1.id',
                        })
                )

                expect(mockStringPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: 'Item 2',
                                k: 'items.1.name',
                        })
                )
        })

        it('should handle null or undefined values', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: {
                                test: {
                                        name: null,
                                        age: undefined,
                                },
                        },
                        writes: new Set(),
                        cache: {},
                } as any

                // Create mock plugins
                const mockStringPlugin = jest.fn()
                const mockNumberPlugin = jest.fn()

                // Call the plugin with null/undefined values
                Nested({
                        a: { name: null, age: undefined },
                        c,
                        k: 'test',
                        schema: {
                                name: mockStringPlugin,
                                age: mockNumberPlugin,
                        },
                } as any)

                // Check that the plugins were called with null/undefined values
                expect(mockStringPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: null,
                                k: 'name',
                        })
                )

                expect(mockNumberPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                a: undefined,
                                k: 'age',
                        })
                )
        })

        it('should pass the parent ctrl object to child plugins', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: {
                                test: {
                                        name: 'Test Name',
                                        age: 30,
                                },
                        },
                        writes: new Set(),
                        cache: {},
                } as any

                // Create mock plugins
                const mockStringPlugin = jest.fn()
                const mockNumberPlugin = jest.fn()

                // Call the plugin
                Nested({
                        a: { name: 'Test Name', age: 30 },
                        c,
                        k: 'test',
                        schema: {
                                name: mockStringPlugin,
                                age: mockNumberPlugin,
                        },
                } as any)

                // Check that the plugins were called with the parent ctrl object
                expect(mockStringPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                c,
                        })
                )

                expect(mockNumberPlugin).toHaveBeenCalledWith(
                        expect.objectContaining({
                                c,
                        })
                )
        })
})
