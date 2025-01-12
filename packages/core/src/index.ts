import Checkbox from './clients/Checkbox'
import Container from './clients/Container'
import InputVector from './clients/InputVector'
import _create, { append } from './helpers/node'
import { is } from './helpers/utils'
import { Config } from './types'
import './index.css'

let container: any

let counter = 0

function register(_e = _create, _r = _render) {
        create = _e
        render = _r
}

function _render(_: any) {
        const root = document.getElementById('root')!
        append(container, root)
}

let render = _render
let create = _create

function ctrl<T extends Config>(current: T) {
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()

        const mount = (el: Element) => {
                if (!counter) container = create(Container, {}, el)
                counter++
                render(container)
                cleanups.add(() => {
                        counter--
                        el.remove()
                        if (!counter) container.remove()
                })
        }

        const attach = (key: string) => {
                const arg = current[key]
                if (is.bol(arg))
                        return create(Checkbox, {
                                x: arg,
                                _x: (x) => set({ [key]: x } as T),
                        })
                if (is.num(arg))
                        return create(InputVector, {
                                x: arg,
                                key,
                                _x: (x) => set({ [key]: x } as T),
                        })
                if (is.arr(arg)) {
                        const change = (_012 = 0) => {
                                return (value = 0) => {
                                        arg[_012] = value
                                        set({ [key]: arg } as T)
                                }
                        }

                        const [x, y, z] = arg
                        const [_x, _y, _z] = [0, 1, 2].map(change)
                        return create(InputVector, { x, y, z, _x, _y, _z, key })
                }

                throw ``
        }

        const sub = (update = () => {}) => {
                listeners.add(update)
                for (const key in current) mount(attach(key)!)
                return () => {
                        cleanups.forEach((f) => f())
                        listeners.delete(update)
                }
        }

        const get = () => {
                return current
        }

        const set = (next: T) => {
                if (is.fun(next)) next = next(current)
                current = { ...current, ...next }
                listeners.forEach((f) => f())
        }

        return { sub, get, set }
}

export type Ctrl = ReturnType<typeof ctrl>

export default ctrl

export { create, render, register }
