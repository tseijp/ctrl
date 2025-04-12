/**
 * Tests for the ctrl helper
 */

import { ctrl, store } from '../../src/helpers/ctrl'
import { createMockCtrl } from '../utils/test-utils'
import { testTargets } from '../utils/fixtures'

// Mock the document for DOM operations
const mockAppendChild = jest.fn()
const mockRemoveChild = jest.fn()
const mockCreateElement = jest.fn().mockImplementation(() => ({
        appendChild: mockAppendChild,
}))

// Mock document
Object.defineProperty(global, 'document', {
        value: {
                createElement: mockCreateElement,
                body: {
                        appendChild: mockAppendChild,
                        removeChild: mockRemoveChild,
                },
        },
        writable: true,
})

describe('ctrl', () => {
        // Clear the store before each test
        beforeEach(() => {
                store.clear()
                jest.clearAllMocks()
        })

        describe('creation', () => {
                it('should create a ctrl object with default values', () => {
                        const c = ctrl({})

                        expect(c).toBeDefined()
                        expect(c.isC).toBe(true)
                        expect(c.id).toBe('c0')
                        expect(c.current).toEqual({})
                        expect(c.parent).toBeNull()
                        // These are getters, not properties
                        expect(c.get()).toBe(0) // updated count
                        expect(c.mount).toBeDefined()
                        expect(c.clean).toBeDefined()
                        expect(c.cache).toEqual({})

                        // Check event sets
                        expect(c.writes).toBeInstanceOf(Set)
                        expect(c.events).toBeInstanceOf(Set)
                        expect(c.actors).toBeInstanceOf(Set)
                        expect(c.mounts).toBeInstanceOf(Set)
                        expect(c.cleans).toBeInstanceOf(Set)

                        // Check methods
                        expect(typeof c.mount).toBe('function')
                        expect(typeof c.clean).toBe('function')
                        expect(typeof c.sub).toBe('function')
                        expect(typeof c.act).toBe('function')
                        expect(typeof c.run).toBe('function')
                        expect(typeof c.set).toBe('function')
                        expect(typeof c.ref).toBe('function')
                        expect(typeof c.get).toBe('function')
                })

                it('should create a ctrl object with custom id', () => {
                        const c = ctrl({}, 'custom-id')
                        expect(c.id).toBe('custom-id')
                })

                it('should create a ctrl object with target values', () => {
                        const c = ctrl(testTargets.multipleValues)
                        expect(c.current).toEqual(testTargets.multipleValues)
                })

                it('should return the same ctrl object for the same target', () => {
                        const target = testTargets.singleValue
                        const c1 = ctrl(target)
                        const c2 = ctrl(target)

                        expect(c1).toBe(c2)
                })

                it('should return the same ctrl object for the same id', () => {
                        const id = 'same-id'
                        const c1 = ctrl({}, id)
                        const c2 = ctrl({}, id)

                        expect(c1).toBe(c2)
                })

                it('should add the ctrl object to the store', () => {
                        const c = ctrl({})
                        expect(store.has(c)).toBe(true)
                })

                it('should throw an error if the store size exceeds 999', () => {
                        // Mock store size
                        Object.defineProperty(store, 'size', { value: 999 })

                        expect(() => ctrl({})).toThrow('Maximum call')
                })
        })

        describe('lifecycle', () => {
                // Note: We can't directly test mounted count as it's a private variable
                // Instead, we test the behavior that depends on it
                it('should call mount and clean correctly', () => {
                        const c = ctrl({})
                        const mockMount = jest.fn()
                        const mockClean = jest.fn()

                        c.mounts.add(mockMount)
                        c.cleans.add(mockClean)

                        // First mount should call mount functions
                        c.mount()
                        expect(mockMount).toHaveBeenCalled()

                        // Second mount should not call mount functions again
                        mockMount.mockClear()
                        c.mount()
                        expect(mockMount).not.toHaveBeenCalled()

                        // First clean should not call clean functions yet
                        c.clean()
                        expect(mockClean).toHaveBeenCalled()

                        // Second clean should not call clean functions again
                        mockClean.mockClear()
                        c.clean()
                        expect(mockClean).not.toHaveBeenCalled()
                })

                it('should call mount functions on mount', () => {
                        const c = ctrl({})
                        const mockFn = jest.fn()
                        c.mounts.add(mockFn)

                        c.mount()
                        expect(mockFn).toHaveBeenCalled()
                })

                it('should call clean functions on clean', () => {
                        const c = ctrl({})
                        const mockFn = jest.fn()
                        c.cleans.add(mockFn)

                        c.mount()
                        c.clean()
                        expect(mockFn).toHaveBeenCalled()
                })

                it('should add parent act to actors on mount if parent exists', () => {
                        const parent = createMockCtrl({})
                        const c = ctrl({})
                        c.parent = parent

                        c.mount()
                        expect(c.actors.has(parent.act)).toBe(true)
                })

                it('should remove parent act from actors on clean if parent exists', () => {
                        const parent = createMockCtrl({})
                        const c = ctrl({})
                        c.parent = parent
                        c.actors.add(parent.act)

                        c.mount()
                        c.clean()
                        expect(c.actors.has(parent.act)).toBe(false)
                })
        })

        describe('subscription', () => {
                it('should add function to actors on sub', () => {
                        const c = ctrl({})
                        const mockFn = jest.fn()

                        c.sub(mockFn)
                        expect(c.actors.has(mockFn)).toBe(true)
                })

                it('should call mount on sub', () => {
                        const c = ctrl({})
                        const mockMount = jest.spyOn(c, 'mount')

                        c.sub(() => {})
                        expect(mockMount).toHaveBeenCalled()
                })

                it('should return a cleanup function', () => {
                        const c = ctrl({})
                        const mockFn = jest.fn()

                        const cleanup = c.sub(mockFn)
                        expect(typeof cleanup).toBe('function')

                        cleanup()
                        expect(c.actors.has(mockFn)).toBe(false)
                })

                it('should call clean on cleanup function', () => {
                        const c = ctrl({})
                        const mockClean = jest.spyOn(c, 'clean')

                        const cleanup = c.sub(() => {})
                        cleanup()

                        expect(mockClean).toHaveBeenCalled()
                })
        })

        describe('state management', () => {
                it('should update value with set', () => {
                        const c = ctrl({ count: 0 })

                        c.set('count', 1)
                        expect(c.current.count).toBe(1)
                })

                it('should increment updated count on set', () => {
                        const c = ctrl({ count: 0 })
                        const initialUpdated = c.get()

                        c.set('count', 1)
                        expect(c.get()).toBe(initialUpdated + 1)
                })

                it('should call events on set', () => {
                        const c = ctrl({ count: 0 })
                        const mockFn = jest.fn()
                        c.events.add(mockFn)

                        c.set('count', 1)
                        expect(mockFn).toHaveBeenCalledWith('count', 1)
                })

                it('should call actors on set', () => {
                        const c = ctrl({ count: 0 })
                        const mockFn = jest.fn()
                        c.actors.add(mockFn)

                        c.set('count', 1)
                        expect(mockFn).toHaveBeenCalled()
                })

                it('should handle uniform values in set', () => {
                        const c = ctrl({ count: { value: 0 } })

                        c.set('count', { value: 1 })
                        expect(c.current.count.value).toBe(1)
                })

                it('should call writes on run', () => {
                        const c = ctrl({ count: 0 })
                        const mockFn = jest.fn()
                        c.writes.add(mockFn)

                        c.run('count', 0)
                        expect(mockFn).toHaveBeenCalledWith('count', 0)
                })

                it('should handle uniform values in run', () => {
                        const c = ctrl({ count: { value: 0 } })
                        const mockFn = jest.fn()
                        c.writes.add(mockFn)

                        c.run('count', { value: 0 })
                        expect(mockFn).toHaveBeenCalledWith('count', {
                                value: 0,
                        })
                })

                it('should update target on ref', () => {
                        const c = ctrl({})
                        const target = { count: 1 }

                        c.ref(target)
                        expect(c.current).toBe(target)
                })

                it('should call mount on ref with target', () => {
                        const c = ctrl({})
                        const mockMount = jest.spyOn(c, 'mount')

                        c.ref({ count: 1 })
                        expect(mockMount).toHaveBeenCalled()
                })

                it('should call clean on ref with null', () => {
                        const c = ctrl({})
                        const mockClean = jest.spyOn(c, 'clean')

                        c.ref(null)
                        expect(mockClean).toHaveBeenCalled()
                })

                it('should return updated count on get', () => {
                        const c = ctrl({})

                        // We can't directly set the updated value as it's private
                        // Instead, we'll trigger updates and check the result
                        const initialValue = c.get()

                        // Trigger an update
                        c.act()

                        expect(c.get()).toBe(initialValue + 1)
                })
        })

        describe('plugin system', () => {
                it('should have plugin array', () => {
                        expect(Array.isArray(ctrl.plugin)).toBe(true)
                })

                it('should add plugins with use', () => {
                        const initialLength = ctrl.plugin.length
                        // Create a proper CustomPlugin with type predicate
                        const mockPlugin = {
                                is: (a: unknown): a is number =>
                                        typeof a === 'number',
                                el: jest.fn(),
                        }

                        ctrl.use(mockPlugin)
                        expect(ctrl.plugin.length).toBe(initialLength + 1)
                        expect(ctrl.plugin[0]).toBe(mockPlugin)
                })

                it('should add multiple plugins with use', () => {
                        const initialLength = ctrl.plugin.length
                        // Create proper CustomPlugins with type predicates
                        const mockPlugin1 = {
                                is: (a: unknown): a is number =>
                                        typeof a === 'number',
                                el: jest.fn(),
                        }
                        const mockPlugin2 = {
                                is: (a: unknown): a is string =>
                                        typeof a === 'string',
                                el: jest.fn(),
                        }

                        ctrl.use(mockPlugin1, mockPlugin2)
                        expect(ctrl.plugin.length).toBe(initialLength + 2)
                })
        })
})
