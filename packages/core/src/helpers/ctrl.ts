import LayersItem from '../clients/LayersItem'
import { append, create, remove } from '../helpers/node'
import { flush, merge } from '../helpers/utils'
import { PluginItem } from '../plugins/index'
import { Ctrl, CustomPlugin, isU, Target } from '../types'

export const store = new Set<Ctrl>()

function ctrl<T extends Target>(current: T, id?: string): Ctrl<T>

function ctrl<T extends Target>(current: T = {} as T, id = `c${store.size}`) {
        for (const c of store) {
                if (c.id === id) return c
                if (c.current === current) return c
        }

        if (store.size >= 999) throw new Error(`@tsei/ctrl Error: Maximum call`)

        let updated = 0
        let mounted = 0
        let _parent = null as null | Ctrl<T>

        const c = {
                get parent() {
                        return _parent
                },
                set parent(p) {
                        _parent = p
                },
                get id() {
                        return id
                },
                set id(_id) {
                        id = _id
                },
                get current() {
                        return current
                },
                get() {
                        return updated
                },
                isC: true,
                cache: {},
        } as Ctrl<T>

        c.writes = new Set()
        c.events = new Set()
        c.actors = new Set()
        c.mounts = new Set()
        c.cleans = new Set()

        c.mount = () => {
                if (mounted++) return
                if (_parent) c.actors.add(_parent.act)
                ctrl.mount(c)
                flush(c.mounts)
        }

        c.clean = () => {
                if (--mounted) return
                if (_parent) c.actors.delete(_parent.act)
                flush(c.cleans)
        }

        c.sub = (fn = () => {}) => {
                c.actors.add(fn)
                c.mount()
                return () => {
                        c.actors.delete(fn)
                        c.clean()
                }
        }

        c.act = () => {
                updated++
                flush(c.actors)
        }

        c.run = (k, a = current[k]) => {
                if (isU(a)) a = a.value
                if (isU(current[k])) current[k].value = a
                else current[k] = a
                flush(c.writes, k, a)
        }

        c.set = (k, a) => {
                try {
                        c.run(k, a) // error if set to a read-only value
                } catch (error) {
                        console.log(error)
                }
                flush(c.events, k, a)
                c.act(k, a)
        }

        c.ref = (target: T) => {
                if (!target) return c.clean()
                current = target
                c.mount()
        }

        store.add(c as any)

        return c
}

ctrl.create = create
ctrl.append = append
ctrl.remove = remove
ctrl.plugin = [] as CustomPlugin[]
ctrl.use = (...args: CustomPlugin[]) => ctrl.plugin.unshift(...args)
ctrl.pluginParent = null as null | Node
ctrl.layersParent = null as null | Node
ctrl.mount = <T extends Target>(c: Ctrl<T>) => {
        const plugin = create(PluginItem, { c })
        append(plugin, ctrl.pluginParent ?? document.body)
        c.cleans.add(() => remove(plugin, ctrl.pluginParent ?? document.body))
        if (!ctrl.layersParent) return
        const layers = create(LayersItem, { c })
        append(layers, ctrl.layersParent)
        c.cleans.add(() => remove(layers, ctrl.pluginParent!))
}

export const register = (override: any) => {
        merge(ctrl, override)
}

export { ctrl }
