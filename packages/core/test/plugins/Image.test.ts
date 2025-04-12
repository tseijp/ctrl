/**
 * Tests for the Image plugin
 */

import Image from '../../src/plugins/Image'
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

describe('Image plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with image element', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-image.jpg' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Image({ a: 'test-image.jpg', c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the image element was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'img',
                        expect.objectContaining({
                                key: 'img',
                                src: 'test-image.jpg',
                                className: expect.stringContaining('image'),
                        })
                )
        })

        it('should support custom width and height', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-image.jpg' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom width and height
                Image({
                        a: 'test-image.jpg',
                        c,
                        k: 'test',
                        width: 300,
                        height: 200,
                } as any)

                // Check that the image was created with the custom width and height
                expect(mockCreate).toHaveBeenCalledWith(
                        'img',
                        expect.objectContaining({
                                width: 300,
                                height: 200,
                        }),
                        expect.anything()
                )
        })

        it('should support custom alt text', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-image.jpg' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom alt text
                Image({
                        a: 'test-image.jpg',
                        c,
                        k: 'test',
                        alt: 'Test image description',
                } as any)

                // Check that the image was created with the custom alt text
                expect(mockCreate).toHaveBeenCalledWith(
                        'img',
                        expect.objectContaining({
                                alt: 'Test image description',
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
                        current: { test: 'test-image.jpg' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom className
                Image({
                        a: 'test-image.jpg',
                        c,
                        k: 'test',
                        className: 'custom-image',
                } as any)

                // Check that the image was created with the custom className
                expect(mockCreate).toHaveBeenCalledWith(
                        'img',
                        expect.objectContaining({
                                className: expect.stringContaining(
                                        'custom-image'
                                ),
                        }),
                        expect.anything()
                )
        })

        it('should add a run function to writes', () => {
                // Create mock elements
                const mockImg = createMockElement('img') as HTMLImageElement

                // Mock the create function to return the mock image for the img element
                mockCreate.mockImplementation((tag, props) => {
                        if (tag === 'img') {
                                return mockImg
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-image.jpg' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Image({ a: 'test-image.jpg', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'img'
                )[1].ref

                // Call the ref function with the mock image
                refFn(mockImg)

                // Check that a function was added to writes
                expect(addSpy).toHaveBeenCalledWith(expect.any(Function))

                // Get the run function
                const runFn = addSpy.mock.calls[0][0] as (
                        key: string,
                        value: string
                ) => void

                // Call the run function with a new value
                runFn('test', 'new-image.jpg')

                // Check that the image's src property was updated
                expect(mockImg.src).toBe('new-image.jpg')
        })

        it('should handle null ref', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-image.jpg' },
                        writes: new Set(),
                        cache: {
                                test: jest.fn(),
                        },
                } as any

                // Call the plugin
                Image({ a: 'test-image.jpg', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'img'
                )[1].ref

                // Call the ref function with null
                refFn(null)

                // Check that the cleanup function was called
                expect(c.cache.test).toHaveBeenCalled()
        })

        it('should clean up when unmounted', () => {
                // Create mock elements
                const mockImg = createMockElement('img') as HTMLImageElement

                // Mock the create function to return the mock image for the img element
                mockCreate.mockImplementation((tag, props) => {
                        if (tag === 'img') {
                                return mockImg
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-image.jpg' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Image({ a: 'test-image.jpg', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'img'
                )[1].ref

                // Call the ref function with the mock image
                refFn(mockImg)

                // Get the cleanup function
                const cleanupFn = c.cache.test

                // Call the cleanup function
                cleanupFn()

                // Check that the run function was removed from writes
                expect(deleteSpy).toHaveBeenCalledWith(expect.any(Function))
        })
})
