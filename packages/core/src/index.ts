import create, { append, HTMLNode, remove } from './helpers/node'
import { is } from './helpers/utils'
import { Config } from './types'
import './index.css'
import { Bool, Float, Vector } from './clients/inputs'
import Container from './clients/Container'

/**
 * main
 */
let counter = 0

function ctrl<T extends Config>(current: T) {
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()

        const init = () => {
                if (is.str(ctrl.parent))
                        ctrl.parent = document.getElementById(ctrl.parent)
                if (ctrl.parent) return
                ctrl.parent = ctrl.create(Container, {})
                ctrl.render(ctrl.parent, document.body)
        }

        const mount = (el: HTMLNode) => {
                if (!counter++) init()
                ctrl.append(el, ctrl.parent!)
                cleanups.add(clean(el))
        }

        const clean = (el: HTMLNode) => () => {
                const p = ctrl.parent
                if (!p || is.str(p)) return
                if (!--counter) return ctrl.finish(p, document.body)
                if (!el || is.str(el)) return
                ctrl.remove(el, p)
        }

        const attach = (k: string) => {
                const arg = current[k]
                const _ = ctrl.create
                if (is.bol(arg)) return _(Bool<T>, { k, arg, set })
                if (is.num(arg)) return _(Float<T>, { k, arg, set })
                if (is.arr(arg)) return _(Vector<T>, { k, arg, set })
                throw `Error: not support type`
        }

        let count = 0

        const sub = (update = () => {}) => {
                listeners.add(update)
                if (!count++) for (const i in current) mount(attach(i))
                return () => {
                        listeners.delete(update)
                        if (!--count) cleanups.forEach((f) => f())
                }
        }

        const get = () => {
                return current
        }

        const set = <K extends keyof T>(key: K, arg: T[K]) => {
                current[key] = arg
                listeners.forEach((f) => f())
        }

        return { sub, get, set }
}

ctrl.create = create
ctrl.append = append
ctrl.render = append
ctrl.remove = remove
ctrl.finish = remove
ctrl.parent = null as null | Node

export function register(override: Record<string, any>) {
        ctrl.create = override.create ?? create
        ctrl.append = override.append ?? append
        ctrl.render = override.render ?? append
        ctrl.remove = override.remove ?? remove
        ctrl.finish = override.finish ?? remove
        ctrl.parent = override.parent ?? null
}

export type Ctrl = ReturnType<typeof ctrl>

export default ctrl

export * from './types'
