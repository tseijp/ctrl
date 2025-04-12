/**
 * Tests for the Video plugin
 */

import Video from '../../src/plugins/Video'
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

describe('Video plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with video element', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Video({ a: 'test-video.mp4', c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the video element was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'video',
                        expect.objectContaining({
                                key: 'video',
                                src: 'test-video.mp4',
                                className: expect.stringContaining('video'),
                                controls: true,
                        })
                )
        })

        it('should support custom width and height', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom width and height
                Video({
                        a: 'test-video.mp4',
                        c,
                        k: 'test',
                        width: 640,
                        height: 360,
                } as any)

                // Check that the video was created with the custom width and height
                expect(mockCreate).toHaveBeenCalledWith(
                        'video',
                        expect.objectContaining({
                                width: 640,
                                height: 360,
                        }),
                        expect.anything()
                )
        })

        it('should support autoplay option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with autoplay option
                Video({
                        a: 'test-video.mp4',
                        c,
                        k: 'test',
                        autoplay: true,
                } as any)

                // Check that the video was created with autoplay attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'video',
                        expect.objectContaining({
                                autoplay: true,
                        }),
                        expect.anything()
                )
        })

        it('should support loop option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with loop option
                Video({
                        a: 'test-video.mp4',
                        c,
                        k: 'test',
                        loop: true,
                } as any)

                // Check that the video was created with loop attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'video',
                        expect.objectContaining({
                                loop: true,
                        }),
                        expect.anything()
                )
        })

        it('should support muted option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with muted option
                Video({
                        a: 'test-video.mp4',
                        c,
                        k: 'test',
                        muted: true,
                } as any)

                // Check that the video was created with muted attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'video',
                        expect.objectContaining({
                                muted: true,
                        }),
                        expect.anything()
                )
        })

        it('should support poster option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with poster option
                Video({
                        a: 'test-video.mp4',
                        c,
                        k: 'test',
                        poster: 'poster.jpg',
                } as any)

                // Check that the video was created with poster attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'video',
                        expect.objectContaining({
                                poster: 'poster.jpg',
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
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom className
                Video({
                        a: 'test-video.mp4',
                        c,
                        k: 'test',
                        className: 'custom-video',
                } as any)

                // Check that the video was created with the custom className
                expect(mockCreate).toHaveBeenCalledWith(
                        'video',
                        expect.objectContaining({
                                className: expect.stringContaining(
                                        'custom-video'
                                ),
                        }),
                        expect.anything()
                )
        })

        it('should add a run function to writes', () => {
                // Create mock elements
                const mockVideo = createMockElement('video') as HTMLVideoElement

                // Mock the create function to return the mock video for the video element
                mockCreate.mockImplementation((tag, props) => {
                        if (tag === 'video') {
                                return mockVideo
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Video({ a: 'test-video.mp4', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'video'
                )[1].ref

                // Call the ref function with the mock video
                refFn(mockVideo)

                // Check that a function was added to writes
                expect(addSpy).toHaveBeenCalledWith(expect.any(Function))

                // Get the run function
                const runFn = addSpy.mock.calls[0][0] as (
                        key: string,
                        value: string
                ) => void

                // Call the run function with a new value
                runFn('test', 'new-video.mp4')

                // Check that the video's src property was updated
                expect(mockVideo.src).toBe('new-video.mp4')
        })

        it('should handle null ref', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {
                                test: jest.fn(),
                        },
                } as any

                // Call the plugin
                Video({ a: 'test-video.mp4', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'video'
                )[1].ref

                // Call the ref function with null
                refFn(null)

                // Check that the cleanup function was called
                expect(c.cache.test).toHaveBeenCalled()
        })

        it('should clean up when unmounted', () => {
                // Create mock elements
                const mockVideo = createMockElement('video') as HTMLVideoElement

                // Mock the create function to return the mock video for the video element
                mockCreate.mockImplementation((tag, props) => {
                        if (tag === 'video') {
                                return mockVideo
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-video.mp4' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Video({ a: 'test-video.mp4', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'video'
                )[1].ref

                // Call the ref function with the mock video
                refFn(mockVideo)

                // Get the cleanup function
                const cleanupFn = c.cache.test

                // Call the cleanup function
                cleanupFn()

                // Check that the run function was removed from writes
                expect(deleteSpy).toHaveBeenCalledWith(expect.any(Function))
        })
})
