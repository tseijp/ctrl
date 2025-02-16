import Container from './clients/Container'
import Controller from './clients/Controller'
import { append, create, HTMLNode, remove } from './helpers/node'
import { flush, is, merge } from './helpers/utils'
import { Plugin } from './plugins/index'
import { isU, Target } from './types'
import './index.css'

let count = 0

const _mount = (el: HTMLNode) => () => {
        if (!count++ && is.str(ctrl.parent))
                ctrl.parent = document.getElementById(ctrl.parent)
        ctrl.append(el, ctrl.parent ?? document.body)
}

const _clean = (el: HTMLNode) => () => {
        if (!ctrl.parent) return
        if (!--count) ctrl.finish(ctrl.parent, document.body)
        if (!el || is.str(el)) return
        ctrl.remove(el, ctrl.parent)
}

const store = new Set()

function ctrl<T extends Target>(current: T = {} as T, id = `c${store.size}`) {
        const children = [] as HTMLNode[]
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()
        const updates = new Set<Function>()
        const mounts = new Set<Function>()

        let updated = 0
        let mounted = 0

        const attach = <K extends keyof T>(k: K) => {
                let a = current[k]
                if (isU(a)) a = a.value
                for (const El of ctrl.plugin) {
                        const el = ctrl.create(El, { key: k, a, c, k })
                        if (el) return children.push(el)
                }
        }

        const mount = () => {
                if (mounted++) return
                for (const k in current) attach(k)
                const props = { key: id, title: id, id }
                const el = ctrl.create(Container, props, children)
                mounts.add(_mount(el))
                cleanups.add(_clean(el))
                flush(mounts)
        }

        const clean = () => {
                if (--mounted) return
                flush(cleanups)
        }

        const sub = (update = () => {}) => {
                listeners.add(update)
                mount()
                return () => {
                        listeners.delete(update)
                        clean()
                }
        }

        const get = () => updated

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
                if (isU(a)) a = a.value
                if (isU(current[k])) current[k].value = a
                else current[k] = a
                flush(updates, k, a)
        }

        const ref = (target: T) => {
                if (!target) return clean()
                current = target
                mount()
        }

        const c = {
                children,
                listeners,
                cleanups,
                updates,
                mounts,
                mount,
                clean,
                sync,
                sub,
                get,
                set,
                ref,
                isC: true,
                cache: {} as any,
                get updated() {
                        return updated
                },
                get mounted() {
                        return mounted
                },
                get id() {
                        return id
                },
                set id(_id: string) {
                        id = _id
                },
                get current() {
                        return current
                },
        }

        store.add(c)

        return c
}

ctrl.create = create
ctrl.append = append
ctrl.render = append
ctrl.remove = remove
ctrl.finish = remove
ctrl.parent = null as null | Node
ctrl.plugin = [Plugin]
ctrl.use = (...args: any[]) => ctrl.plugin.unshift(...args)

export function register(override: any) {
        merge(ctrl, override)
}

export type Ctrl<T extends Target = Target> = ReturnType<typeof ctrl<T>>

export { ctrl, Controller, store }

export default ctrl

export * from './helpers/drag'
export * from './helpers/node'
export * from './helpers/utils'
export * from './helpers/wheel'
export * from './types'
