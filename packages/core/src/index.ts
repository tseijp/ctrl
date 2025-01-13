import Container from './clients/Container'
import create, { append, HTMLNode } from './helpers/node'
import { is } from './helpers/utils'
import { Config } from './types'
import './index.css'
import { Bool, Float, Vector } from './clients/inputs'

let container: any
let counter = 0

function register(override: Record<string, any>) {
        _ = override.create ?? create
        _append = override.append ?? append
        _render = override.render ?? append
}

let _ = create
let _append = append
let _render = append

/**
 * main
 */
function ctrl<T extends Config>(current: T) {
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()

        const attach = (k: string) => {
                const arg = current[k]
                if (is.bol(arg)) return _(Bool<T>, { k, arg, set })
                if (is.num(arg)) return _(Float<T>, { k, arg, set })
                if (is.arr(arg)) return _(Vector<T>, { k, arg, set })
                throw `Error: not support type`
        }

        const mount = (el: HTMLNode) => {
                if (!counter++) {
                        container = _(Container, {}, el)
                        _render(container, document.body)
                }
                _render(el, container)
                cleanups.add(clean(el))
        }

        const clean = (el: HTMLNode) => () => {
                if (!--counter) return container.remove()
                if (el && !is.str(el)) el.remove()
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

export type Ctrl = ReturnType<typeof ctrl>

export default ctrl

export * from './types'

export { _ as create, _append as append, _render as render, register }
