import Container from './clients/Container'
import Controller from './clients/Controller'
import { append, create, remove, HTMLNode } from './helpers/node'
import { flush, is, merge } from './helpers/utils'
import attach from './inputs/attach'
import { Config, Uniform } from './types'
import './index.css'

/**
 * utils
 */
export const PARENT_ID = '_ctrl-parent'

export const isU = <T>(a: unknown): a is Uniform<T> => {
        if (!is.obj(a)) return false
        if ('value' in a) return true
        return false
}

export const isC = <T extends Config>(a: unknown): a is Ctrl<T> => {
        if (!is.obj(a)) return false
        if ('isC' in a) return true
        return false
}

let isInit = 0

const init = () => {
        if (is.str(ctrl.parent))
                ctrl.parent = document.getElementById(ctrl.parent)
        if (ctrl.parent) return
        ctrl.parent = ctrl.create(Container)
        ctrl.render(ctrl.parent, document.body)
}

const mount = (el?: HTMLNode) => {
        if (!el) return
        if (!isInit++) init()
        ctrl.append(el, ctrl.parent!)
        return clean(el)
}

const clean = (el?: HTMLNode) => () => {
        const p = ctrl.parent
        if (!p || is.str(p)) return
        if (!--isInit) ctrl.finish(p, document.body)
        if (!el || is.str(el)) return
        ctrl.remove(el, p)
}

/**
 * main
 */
function ctrl<T extends Config>(current: T) {
        /**
         * private method
         */
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()

        /**
         * public method
         */
        let inited = 0
        let updated = 0

        const sub = (update = () => {}) => {
                listeners.add(update)
                if (!inited++)
                        for (const i in current) {
                                const cleanup = mount(attach<T>(c, i))
                                if (cleanup) cleanups.add(cleanup)
                        }
                return () => {
                        listeners.delete(update)
                        if (!--inited) flush(cleanups)
                }
        }

        const get = () => {
                return updated
        }

        const set = <K extends keyof T>(key: K, a: T[K]) => {
                if (isU<T[K]>(current[key])) {
                        current[key].value = a
                } else current[key] = a
                updated++
                flush(listeners, key, a)
        }

        let _clean = () => {}

        const ref = (target: T) => {
                if (!target) return _clean()
                current = target
                _clean = sub()
        }

        const c = {
                listeners,
                cleanups,
                sub,
                get,
                set,
                ref,
                isC: true,
                get current() {
                        return current
                },
        }

        return c
}

ctrl.create = create
ctrl.append = append
ctrl.render = append
ctrl.remove = remove
ctrl.finish = remove
ctrl.parent = null as null | Node

export function register(override: any) {
        merge(ctrl, override)
}

export type Ctrl<T extends Config> = ReturnType<typeof ctrl<T>>

export { ctrl, Controller }

export default ctrl

export * from './helpers/drag'
export * from './helpers/node'
export * from './helpers/utils'
export * from './helpers/wheel'
export * from './types'
