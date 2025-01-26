import Container from './clients/Container'
import Controller from './clients/Controller'
import { Bool, Float, Vector } from './clients/inputs'
import { append, create, remove, HTMLNode } from './helpers/node'
import { flush, is, merge } from './helpers/utils'
import { Config, Uniform } from './types'
import './index.css'

/**
 * utils
 */
const isU = <T>(a: unknown): a is Uniform<T> => {
        if (!is.obj(a)) return false
        if ('value' in a) return true
        return false
}

let counter = 0

const init = () => {
        if (is.str(ctrl.parent))
                ctrl.parent = document.getElementById(ctrl.parent)
        if (ctrl.parent) return
        ctrl.parent = ctrl.create(Container)
        ctrl.render(ctrl.parent, document.body)
}

const mount = (el?: HTMLNode) => {
        if (!el) return
        if (!counter++) init()
        ctrl.append(el, ctrl.parent!)
        return clean(el)
}

const clean = (el?: HTMLNode) => () => {
        const p = ctrl.parent
        if (!p || is.str(p)) return
        if (!--counter) return ctrl.finish(p, document.body)
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

        const attach = <K extends keyof T>(k: K) => {
                let arg = current[k]
                if (isU<T[K]>(arg)) arg = arg.value
                const _ = ctrl.create
                if (is.bol(arg)) return _(Bool<T>, { key: k, k, arg, set })
                if (is.num(arg)) return _(Float<T>, { key: k, k, arg, set })
                if (is.arr(arg)) return _(Vector<T>, { key: k, k, arg, set })
        }

        /**
         * public method
         */
        let count = 0
        let updated = 0

        const sub = (update = () => {}) => {
                listeners.add(update)
                if (!count++)
                        for (const i in current) {
                                const cleanup = mount(attach(i))
                                if (cleanup) cleanups.add(cleanup)
                        }
                return () => {
                        listeners.delete(update)
                        if (!--count) flush(cleanups)
                }
        }

        const get = () => {
                return updated
        }

        const set = <K extends keyof T>(key: K, arg: T[K]) => {
                if (isU<T[K]>(current[key])) {
                        current[key].value = arg
                } else current[key] = arg
                updated++
                flush(listeners)
        }

        let _clean = () => {}

        const ref = (target: T) => {
                if (!target) return _clean()
                current = target
                _clean = sub()
        }

        return {
                sub,
                get,
                set,
                ref,
                get current() {
                        return current
                },
        }
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

export type Ctrl = ReturnType<typeof ctrl>

export { ctrl, Controller }

export default ctrl

export * from './helpers/drag'
export * from './helpers/node'
export * from './helpers/utils'
export * from './helpers/wheel'
export * from './types'
