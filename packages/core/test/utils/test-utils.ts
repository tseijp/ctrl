/**
 * Test utilities for @tsei/ctrl
 */

import { Ctrl, Target } from '../../src/types'

/**
 * Creates a mock DOM element
 * @param tag HTML tag name
 * @param attributes Element attributes
 * @returns HTMLElement
 */
export function createMockElement(
        tag: string = 'div',
        attributes: Record<string, string> = {}
): HTMLElement {
        const element = document.createElement(tag)
        Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value)
        })
        return element
}

/**
 * Creates a mock event
 * @param type Event type
 * @param props Event properties
 * @returns Event
 */
export function createMockEvent(
        type: string = 'click',
        props: Record<string, any> = {}
): Event {
        const event = new Event(type)
        Object.entries(props).forEach(([key, value]) => {
                Object.defineProperty(event, key, {
                        value,
                        configurable: true,
                })
        })
        return event
}

/**
 * Creates a mock touch event
 * @param type Event type
 * @param touches Touch list
 * @returns TouchEvent
 */
export function createMockTouchEvent(
        type: string = 'touchstart',
        touches: Touch[] = []
): TouchEvent {
        // Create a basic event
        const event = new Event(type) as unknown as TouchEvent

        // Mock touches and changedTouches
        Object.defineProperty(event, 'touches', {
                value: touches,
                configurable: true,
        })

        Object.defineProperty(event, 'changedTouches', {
                value: touches,
                configurable: true,
        })

        return event
}

/**
 * Creates a mock pointer event
 * @param type Event type
 * @param props Event properties
 * @returns PointerEvent
 */
export function createMockPointerEvent(
        type: string = 'pointerdown',
        props: Record<string, any> = {}
): PointerEvent {
        return new PointerEvent(type, {
                clientX: 0,
                clientY: 0,
                ...props,
        })
}

/**
 * Creates a mock Ctrl object for testing
 * @param current Target object
 * @param id Ctrl ID
 * @returns Mock Ctrl object
 */
export function createMockCtrl<T extends Target = Target>(
        current: T = {} as T,
        id: string = 'test-ctrl'
): Ctrl<T> {
        let updated = 0
        let mounted = 0
        let parentCtrl: Ctrl | null = null

        // Create a safe copy of current that can be modified
        const currentCopy = { ...current } as unknown as T

        const mockCtrl = {
                get updated() {
                        return updated
                },
                get mounted() {
                        return mounted
                },
                get parent(): null | Ctrl<Target> {
                        return parentCtrl
                },
                set parent(parent: Ctrl) {
                        parentCtrl = parent
                },
                get id() {
                        return id
                },
                set id(newId: string) {
                        // Mock setter
                },
                get current() {
                        return currentCopy
                },
                writes: new Set<Function>(),
                events: new Set<Function>(),
                actors: new Set<Function>(),
                mounts: new Set<Function>(),
                cleans: new Set<Function>(),
                mount: jest.fn(() => {
                        mounted++
                        mockCtrl.mounts.forEach((fn: Function) => fn())
                }),
                clean: jest.fn(() => {
                        mounted--
                        mockCtrl.cleans.forEach((fn: Function) => fn())
                }),
                update: jest.fn((k: string, a: any) => {
                        ;(currentCopy as any)[k] = a
                        updated++
                }),
                sub: jest.fn((fn?: Function) => {
                        if (fn) mockCtrl.actors.add(fn)
                        mockCtrl.mount()
                        return () => {
                                if (fn) mockCtrl.actors.delete(fn)
                                mockCtrl.clean()
                        }
                }),
                get: jest.fn(() => updated),
                set: jest.fn((k: string, a: any) => {
                        ;(currentCopy as any)[k] = a
                        updated++
                        mockCtrl.actors.forEach((fn: Function) => fn(k, a))
                }),
                sync: jest.fn((k: string, a?: any) => {
                        if (a !== undefined) (currentCopy as any)[k] = a
                        return (currentCopy as any)[k]
                }),
                ref: jest.fn((target: T | null) => {
                        if (!target) return mockCtrl.clean()
                        Object.assign(currentCopy, target)
                        mockCtrl.mount()
                }),
                isC: true,
                cache: {},
                act: jest.fn(() => {
                        updated++
                        mockCtrl.actors.forEach((fn: Function) => fn())
                }),
                run: jest.fn((k: string, a: any) => {
                        mockCtrl.writes.forEach((fn: Function) => fn(k, a))
                }),
        } as unknown as Ctrl<T>

        return mockCtrl
}

/**
 * Waits for a specified time
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export function wait(ms: number = 0): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mocks requestAnimationFrame
 * @param callback Function to call on next animation frame
 * @returns Request ID
 */
export function mockRAF(callback: FrameRequestCallback): number {
        return setTimeout(() => callback(Date.now()), 16) as unknown as number
}

/**
 * Cancels a mocked requestAnimationFrame
 * @param id Request ID
 */
export function mockCancelRAF(id: number): void {
        clearTimeout(id)
}
