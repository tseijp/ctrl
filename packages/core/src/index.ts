import Container from './clients/Container'
import _create, { append, HTMLNode } from './helpers/node'
import { is } from './helpers/utils'
import { Config } from './types'
import './index.css'
import { Bool, Float, Vector } from './clients/inputs'

let container: any
let counter = 0

function register(_e = _create, _r = append) {
        create = _e
        render = _r
}

let render = append
let create = _create

/**
 * main
 */
function ctrl<T extends Config>(current: T) {
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()

        const attach = (k: string) => {
                const arg = current[k]
                if (is.bol(arg)) return create(Bool<T>, { k, arg, set })
                if (is.num(arg)) return create(Float<T>, { k, arg, set })
                if (is.arr(arg)) return create(Vector<T>, { k, arg, set })
                throw `Error: not support type`
        }

        const mount = (el: HTMLNode) => {
                if (!counter++) {
                        container = create(Container, {}, el)
                        render(container, document.body)
                }
                render(el, container)
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

export { create, render, register }
