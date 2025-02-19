import Controller from './clients/Controller'
import { append, create, remove } from './helpers/node'
import { flush, is, merge } from './helpers/utils'
import { DefaultPlugin, PluginItem } from './plugins/index'
import { isU, Target } from './types'
import './index.css'
import LayersItem from './clients/LayersItem'

const store = new Set<any>()
window.store = store
function ctrl<T extends Target>(current: T = {} as T, id = `c${store.size}`) {
        // filter cached object
        for (const c of store) if (c.id === id) return c

        const listeners = new Set<Function>()
        const cleanups = new Set<Function>()
        const updates = new Set<Function>()

        let updated = 0
        let mounted = 0
        let parent = null as null | Ctrl

        const mount = () => {
                if (mounted++) return
                ctrl.mount(c)
        }

        const clean = () => {
                if (--mounted) return
                flush(cleanups)
        }

        const update = <K extends keyof T & string>(k: K, a: T[K]) => {
                flush(listeners, k, a)
        }

        const sub = (update = () => {}) => {
                listeners.add(update)
                mount()
                if (parent) listeners.add(parent.update)
                return () => {
                        listeners.delete(update)
                        clean()
                }
        }

        const get = () => updated

        const set = <K extends keyof T & string>(k: K, a: T[K]) => {
                updated++
                try {
                        sync(k, a) // error if set to a read-only value
                } catch (error) {
                        console.log(error)
                }
                update(k, a)
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
                listeners,
                cleanups,
                updates,
                mount,
                clean,
                update,
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
                get parent() {
                        return parent
                },
                set parent(_parent) {
                        parent = _parent
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
ctrl.remove = remove
ctrl.plugin = [DefaultPlugin]
ctrl.use = (...args: any[]) => ctrl.plugin.unshift(...args)
ctrl.pluginParent = null as null | Node
ctrl.layersParent = null as null | Node
ctrl.mount = <T extends Target>(c: Ctrl<T>) => {
        const plugin = create(PluginItem, { c })
        append(plugin, ctrl.pluginParent ?? document.body)
        c.cleanups.add(() => remove(plugin, ctrl.pluginParent ?? document.body))
        if (!ctrl.layersParent) return
        const layers = create(LayersItem, { id: c.id })
        append(layers, ctrl.layersParent)
        c.cleanups.add(() => remove(layers, ctrl.pluginParent!))
}

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
export * from './plugins/index'
export * from './types'
