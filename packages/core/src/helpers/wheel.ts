import { vec2, addV, cpV, Vec2 } from './utils'

const LINE_HEIGHT = 40

const PAGE_HEIGHT = 800

const wheelValues = (event: Event, out: Vec2): Vec2 => {
        if (!(event instanceof WheelEvent)) return vec2(0, 0, out)

        let { deltaX, deltaY, deltaMode } = event
        if (deltaMode === 1) {
                deltaX *= LINE_HEIGHT
                deltaY *= LINE_HEIGHT
        } else if (deltaMode === 2) {
                deltaX *= PAGE_HEIGHT
                deltaY *= PAGE_HEIGHT
        }
        return vec2(deltaX, deltaY, out)
}

export const wheelEvent = (callback: WheelCallback) => {
        const initValues = () => {
                vec2(0, 0, state.value)
                vec2(0, 0, state._value)
                vec2(0, 0, state.delta)
                vec2(0, 0, state.movement)
        }

        const onWheel = () => {
                state.isWheelStart = state.active && !state._active
                state.isWheeling = state.active && state._active
                state.isWheelEnd = !state.active && state._active
                callback(state)
        }

        const onWheelStart = (e: WheelEvent) => {
                state.event = e
                state.active = true
                wheelValues(e, state.delta)
                onWheel()
        }

        const onWheeling = (e: Event) => {
                // register onWheelEnd
                const id = setTimeout(() => onWheelEnd(e), state.timeout)
                state.clearTimeout()
                state.clearTimeout = () => clearTimeout(id)
                state.event = e
                if (!state.active) {
                        onWheelStart(e as WheelEvent)
                        return
                }

                state._active = state.active
                cpV(state.value, state._value)
                wheelValues(e, state.delta)
                addV(state.offset, state.delta, state.offset)
                addV(state.movement, state.delta, state.movement)
                onWheel()
        }

        const onWheelEnd = (e: Event) => {
                state.event = e
                state.active = false
                initValues()
                onWheel()
        }

        const onMount = (target: Element) => {
                state.target = target
                target.addEventListener('wheel', onWheeling, { passive: false })
        }

        const onClean = () => {
                const target = state.target
                if (!target) return
                target.removeEventListener('wheel', onWheeling)
        }

        const ref = (el: Element | null) => {
                if (el) {
                        onMount(el)
                } else onClean()
        }

        const state = {
                active: false,
                _active: false,
                _value: vec2(0, 0),
                value: vec2(0, 0),
                delta: vec2(0, 0),
                offset: vec2(0, 0),
                movement: vec2(0, 0),
                target: null as unknown as Element,
                event: null as unknown as Event,
                timeout: 100,
                clearTimeout: () => {},
                memo: {},
                isWheelStart: false,
                isWheeling: false,
                isWheelEnd: false,
                onWheel,
                onWheelStart,
                onWheeling,
                onWheelEnd,
                onMount,
                onClean,
                ref,
        }

        return state
}

export type WheelState = ReturnType<typeof wheelEvent>

export type WheelCallback = (state: WheelState) => void
