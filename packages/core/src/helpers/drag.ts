import { addV, cpV, subV, Vec2, vec2 } from './utils'

/**
 * SUPPORT
 */
const isBrowser =
        typeof window !== 'undefined' &&
        !!window.document &&
        !!window.document.createElement

const supportsTouchEvents = () => isBrowser && 'ontouchstart' in window

const isTouchScreen = () =>
        supportsTouchEvents() ||
        (isBrowser && window.navigator.maxTouchPoints > 1)

const supportsPointerEvents = () => isBrowser && 'onpointerdown' in window

const supportsPointerLock = () =>
        isBrowser && 'exitPointerLock' in window.document

const supportsGestureEvents = () => {
        try {
                // @ts-ignore eslint-disable-next-line
                return 'constructor' in GestureEvent
        } catch (e) {
                return false
        }
}

export const SUPPORT: Record<string, boolean> = {
        // Mac
        isBrowser, // true
        get gesture() {
                return (
                        SUPPORT._gesture ??
                        (SUPPORT._gesture = supportsGestureEvents())
                )
        },
        get touch() {
                return (
                        SUPPORT._touch ??
                        (SUPPORT._touch = supportsTouchEvents())
                )
        },
        get touchscreen() {
                return (
                        SUPPORT._touchscreen ??
                        (SUPPORT._touchscreen = isTouchScreen())
                )
        },
        get pointer() {
                return (
                        SUPPORT._pointer ??
                        (SUPPORT._pointer = supportsPointerEvents())
                )
        },
        get pointerLock() {
                return (
                        SUPPORT._pointerLock ??
                        (SUPPORT._pointerLock = supportsPointerLock())
                )
        },
}

/**
 * https://github.com/pmndrs/use-gesture/blob/main/packages/core/src/config/dragConfigResolver.ts
 */
export const getDevice = (lock = false) => {
        const pointerLock = lock && SUPPORT.pointerLock
        if (pointerLock) return 'mouse'
        if (SUPPORT.touch) return 'touch'
        if (SUPPORT.pointer) return 'pointer'
        return 'mouse'
}

export const getClientVec2 = (e: any, device: unknown, out: Vec2): Vec2 => {
        if (device !== 'touch') {
                return vec2(e.clientX, e.clientY, out)
        }
        const [touch] = e.changedTouches
        return vec2(touch.clientX, touch.clientY, out)
}

export const EVENT_FOR_DRAG = {
        touch: {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend',
                up: 'touchcancel',
        },
        pointer: {
                start: 'pointerdown',
                move: 'pointermove',
                end: 'pointerup',
                up: 'pointercancel',
        },
        mouse: {
                start: 'mousedown',
                move: 'mousemove',
                end: 'mouseup',
                up: 'mousecancel',
        },
} as any

export const dragEvent = (callback: Callback) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const onDrag = () => {
                self.isDragStart = self.active && !self._active
                self.isDragging = self.active && self._active
                self.isDragEnd = !self.active && self._active
                callback(self)
        }

        const onDragStart = (e: Event) => {
                self.event = e
                self.active = true
                getClientVec2(e, self.device, self.value)
                if (self.target?.setPointerCapture && 'pointerId' in e)
                        // @ts-ignore
                        self.target.setPointerCapture(e.pointerId)
                onDrag()
        }

        const onDragging = (e: Event) => {
                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                getClientVec2(e, self.device, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                onDrag()
        }

        const onDragEnd = (e: Event) => {
                self.event = e
                self.active = false
                initValues()
                if (self.target?.releasePointerCapture && 'pointerId' in e)
                        self.target.releasePointerCapture(e.pointerId as number)
                onDrag()
        }

        const onMount = (target: Element) => {
                self.target = target
                const { start, move, end, up } = EVENT_FOR_DRAG[self.device]
                target.addEventListener(start, onDragStart)
                target.addEventListener(move, onDragging)
                target.addEventListener(end, onDragEnd)
                target.addEventListener(up, onDragEnd)
        }

        const onClean = () => {
                const target = self.target
                if (!target) return
                const { start, move, end, up } = EVENT_FOR_DRAG[self.device]
                target.removeEventListener(start, onDragStart)
                target.removeEventListener(move, onDragging)
                target.removeEventListener(end, onDragEnd)
                target.removeEventListener(up, onDragEnd)
        }

        const ref = (el: Element) => {
                if (el) {
                        self.onMount(el)
                } else self.onClean()
        }

        const self = {
                _active: false,
                active: false,
                device: getDevice(),
                _value: vec2(0, 0),
                value: vec2(0, 0),
                delta: vec2(0, 0),
                offset: vec2(0, 0),
                movement: vec2(0, 0),
                target: null as Element | null,
                event: null as Event | null,
                memo: {},
                isDragStart: false,
                isDragging: false,
                isDragEnd: false,
                onDrag,
                onDragStart,
                onDragging,
                onDragEnd,
                onMount,
                onClean,
                ref,
        }

        return self
}

type Drag = ReturnType<typeof dragEvent>

type Callback = (self: Drag) => void
