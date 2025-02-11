import Container from './clients/Container'
import Controller from './clients/Controller'
import { append, create, HTMLNode, remove } from './helpers/node'
import { flush, is, merge } from './helpers/utils'
import { Plugin } from './plugins/index'
import { isU, Target } from './types'
import './index.css'

let index = 0

let isInit = 0

export const init = () => {
        if (is.str(ctrl.parent))
                ctrl.parent = document.getElementById(ctrl.parent)
}

export const mount = (el?: HTMLNode) => {
        if (!el) return
        if (!isInit++) init()
        ctrl.append(el, ctrl.parent ?? document.body)
        return clean(el)
}

export const clean = (el?: HTMLNode) => () => {
        const p = ctrl.parent
        if (!p || is.str(p)) return
        if (!--isInit) ctrl.finish(p, document.body)
        if (!el || is.str(el)) return
        ctrl.remove(el, p)
}

function ctrl<T extends Target>(current: T = {} as T) {
        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()
        const updates = new Set<Function>()
        const mounts = new Set<Function>()
        const elements = [] as HTMLNode[]

        let title = 'ctrl' + index++
        let inited = 0
        let updated = 0

        const attach = (k = '') => {
                let a = current[k]
                const _ = ctrl.create
                if (isU<T[keyof T]>(a)) a = a.value
                for (const El of ctrl.plugin) {
                        const el = _(El, { key: k, a, c, k })
                        if (el) return elements.push(el)
                }
        }

        const sub = (update = () => {}) => {
                if (!inited++) {
                        for (const k in current) attach(k)
                        const props = { title, key: title, isDraggable: false }
                        const _ = ctrl.create
                        const el = _(Container, props, elements)
                        const cleanup = mount(el)
                        if (cleanup) cleanups.add(cleanup)
                }
                listeners.add(update)
                flush(mounts)
                return () => {
                        listeners.delete(update)
                        if (!--inited) flush(cleanups)
                }
        }

        const get = () => updated

        const _get = () => inited

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
                if (isU<T[K]>(a)) a = a.value
                if (isU<T[K]>(current[k])) current[k].value = a
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
                mounts,
                elements,
                sync,
                sub,
                get,
                _get,
                set,
                ref,
                isC: true,
                cache: {} as any,
                set title(_title: string) {
                        title = _title
                },
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
ctrl.plugin = [Plugin]
ctrl.use = (...args: any[]) => ctrl.plugin.unshift(...args)

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
