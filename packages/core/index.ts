import Checkbox from './clients/Checkbox'
import Container from './clients/Container'
import InputVector from './clients/InputVector'
import { append } from './helpers/node'
import { is } from './helpers/utils'
import { Config } from './types'

let container: HTMLDivElement
let counter = 0

export default function ctrl<T extends Config>(current: T) {
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()

        const mount = (el: Element) => {
                if (!counter) container = Container()
                counter++
                append(container, el)
                cleanups.add(() => {
                        counter--
                        el.remove()
                        if (!counter) container.remove()
                })
        }

        const attach = (key: string) => {
                const arg = current[key]
                if (is.bol(arg))
                        return Checkbox({
                                x: arg,
                                _x: (x) => set({ [key]: x } as T),
                        })
                if (is.num(arg))
                        return InputVector({
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
                        return InputVector({ x, y, z, _x, _y, _z, key })
                }

                throw ``
        }

        const sub = (update = () => {}) => {
                listeners.add(update)
                for (const key in current) mount(attach(key))
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

        const ctrl = { sub, get, set }
        return ctrl
}

export type Ctrl = ReturnType<typeof ctrl>
