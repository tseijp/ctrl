import Controller from './clients/Controller'
import { append, create, remove } from './helpers/node'
import { flush, is, merge } from './helpers/utils'
import { attach, mount } from './inputs/index'
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

/**
 * main
 */
function ctrl<T extends Config>(current: T) {
        /**
         * private method
         */
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()
        const updates = new Set<Function>()

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

        const set = <K extends keyof T>(k: K, a: T[K]) => {
                updated++
                sync(k, a)
                flush(listeners, k, a)
        }

        const sync = <K extends keyof T>(k: K, a = current[k]) => {
                if (isU<T[K]>(a)) a = a.value
                if (isU<T[K]>(current[k])) {
                        current[k].value = a
                } else current[k] = a
                if (isU<T[K]>(a)) a = a.value
                flush(updates, k, a)
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
                updates,
                sync,
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
