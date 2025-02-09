import Controller from './clients/Controller'
import { append, create, remove } from './helpers/node'
import { flush, merge } from './helpers/utils'
import { attach, mount } from './inputs/index'
import { isU, Target } from './types'
import './index.css'

function ctrl<T extends Target>(current: T = {} as T) {
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()
        const updates = new Set<Function>()

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
                try {
                        sync(k, a) // error if set to a read-only value
                } catch (error) {
                        console.log(error)
                }
                flush(listeners, k, a)
        }

        const sync = <K extends keyof T>(k: K, a = current[k]) => {
                if (isU<T[K]>(current[k])) current[k].value = a = a.value
                else current[k] = a
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

export type Ctrl<T extends Target> = ReturnType<typeof ctrl<T>>

export { ctrl, Controller }

export default ctrl

export * from './helpers/drag'
export * from './helpers/node'
export * from './helpers/utils'
export * from './helpers/wheel'
export * from './types'
