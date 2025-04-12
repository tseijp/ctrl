/**
 * Tests for the Audio plugin
 */

import Audio from '../../src/plugins/Audio'
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

describe('Audio plugin', () => {
        beforeEach(() => {
                jest.clearAllMocks()
        })

        it('should create a fieldset with audio element', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin
                Audio({ a: 'test-audio.mp3', c, k: 'test' } as any)

                // Check that the fieldset was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'fieldset',
                        expect.objectContaining({
                                id: 'test-id.test',
                        }),
                        expect.anything(),
                        expect.anything()
                )

                // Check that the audio element was created
                expect(mockCreate).toHaveBeenCalledWith(
                        'audio',
                        expect.objectContaining({
                                key: 'audio',
                                src: 'test-audio.mp3',
                                className: expect.stringContaining('audio'),
                                controls: true,
                        })
                )
        })

        it('should support autoplay option', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with autoplay option
                Audio({
                        a: 'test-audio.mp3',
                        c,
                        k: 'test',
                        autoplay: true,
                } as any)

                // Check that the audio was created with autoplay attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'audio',
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
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with loop option
                Audio({
                        a: 'test-audio.mp3',
                        c,
                        k: 'test',
                        loop: true,
                } as any)

                // Check that the audio was created with loop attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'audio',
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
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with muted option
                Audio({
                        a: 'test-audio.mp3',
                        c,
                        k: 'test',
                        muted: true,
                } as any)

                // Check that the audio was created with muted attribute
                expect(mockCreate).toHaveBeenCalledWith(
                        'audio',
                        expect.objectContaining({
                                muted: true,
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
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Call the plugin with custom className
                Audio({
                        a: 'test-audio.mp3',
                        c,
                        k: 'test',
                        className: 'custom-audio',
                } as any)

                // Check that the audio was created with the custom className
                expect(mockCreate).toHaveBeenCalledWith(
                        'audio',
                        expect.objectContaining({
                                className: expect.stringContaining(
                                        'custom-audio'
                                ),
                        }),
                        expect.anything()
                )
        })

        it('should add a run function to writes', () => {
                // Create mock elements
                const mockAudio = createMockElement('audio') as HTMLAudioElement

                // Mock the create function to return the mock audio for the audio element
                mockCreate.mockImplementation((tag, props) => {
                        if (tag === 'audio') {
                                return mockAudio
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.add method
                const addSpy = jest.spyOn(c.writes, 'add')

                // Call the plugin
                Audio({ a: 'test-audio.mp3', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'audio'
                )[1].ref

                // Call the ref function with the mock audio
                refFn(mockAudio)

                // Check that a function was added to writes
                expect(addSpy).toHaveBeenCalledWith(expect.any(Function))

                // Get the run function
                const runFn = addSpy.mock.calls[0][0] as (
                        key: string,
                        value: string
                ) => void

                // Call the run function with a new value
                runFn('test', 'new-audio.mp3')

                // Check that the audio's src property was updated
                expect(mockAudio.src).toBe('new-audio.mp3')
        })

        it('should handle null ref', () => {
                // Mock the create function to return the first argument
                mockCreate.mockImplementation((tag) => tag)

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {
                                test: jest.fn(),
                        },
                } as any

                // Call the plugin
                Audio({ a: 'test-audio.mp3', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'audio'
                )[1].ref

                // Call the ref function with null
                refFn(null)

                // Check that the cleanup function was called
                expect(c.cache.test).toHaveBeenCalled()
        })

        it('should clean up when unmounted', () => {
                // Create mock elements
                const mockAudio = createMockElement('audio') as HTMLAudioElement

                // Mock the create function to return the mock audio for the audio element
                mockCreate.mockImplementation((tag, props) => {
                        if (tag === 'audio') {
                                return mockAudio
                        }
                        return tag
                })

                // Create a mock ctrl object
                const c = {
                        id: 'test-id',
                        current: { test: 'test-audio.mp3' },
                        writes: new Set(),
                        cache: {},
                } as any

                // Spy on the writes.delete method
                const deleteSpy = jest.spyOn(c.writes, 'delete')

                // Call the plugin
                Audio({ a: 'test-audio.mp3', c, k: 'test' } as any)

                // Get the ref function
                const refFn = mockCreate.mock.calls.find(
                        (call) => call[0] === 'audio'
                )[1].ref

                // Call the ref function with the mock audio
                refFn(mockAudio)

                // Get the cleanup function
                const cleanupFn = c.cache.test

                // Call the cleanup function
                cleanupFn()

                // Check that the run function was removed from writes
                expect(deleteSpy).toHaveBeenCalledWith(expect.any(Function))
        })
})
