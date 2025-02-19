'use client'

// @ts-ignore
import { createElement as _, useState, useSyncExternalStore } from 'react'
import _Controller from './clients/Controller'
import LayersItem from './clients/LayersItem'
import { PluginItem } from './plugins/index'
import { Ctrl, ctrl, flush, isC, register } from './index'
import { Target } from './types'

export * from './index'

function useCtrl<T extends Target>(c: Ctrl<T>, id?: string): T

function useCtrl<T extends Target>(config: T, id?: string): T

function useCtrl<T extends Target>(config: T, id?: string) {
        const [c] = useState(() => {
                if (isC(config)) return config
                return ctrl<T>(config, id)
        })
        useSyncExternalStore(c.sub, c.get, c.get)
        return c.current
}

export { useCtrl }

export default useCtrl

interface Props {
        left?: React.ReactNode
        right?: React.ReactNode
        children: React.ReactNode
}

const _layers = new Set<React.ReactNode>()
const _plugin = new Set<React.ReactNode>()
const listeners = new Set<Function>()

let updated = 0

const get = () => updated

const sub = (update = () => {}) => {
        listeners.add(update)
        return () => {
                listeners.delete(update)
        }
}

function mount(c: Ctrl) {
        const { id } = c
        updated++
        const plugin = _(PluginItem, { c, key: id })
        _plugin.add(plugin)
        c.cleanups.add(() => _plugin.delete(plugin))
        if (ctrl.layersParent) {
                const layers = _(LayersItem, { key: id, id })
                _layers.add(layers)
                c.cleanups.add(() => _layers.delete(layers))
        }
        flush(listeners)
        c.cleanups.add(() => {
                updated++
                flush(listeners)
        })
}

let isInitialized = false

function initialize() {
        if (isInitialized) return
        isInitialized = true
        register({ mount, create: _ })
}

function Plugins() {
        useSyncExternalStore(sub, get, get)
        return [..._plugin]
}

function Layers() {
        useSyncExternalStore(sub, get, get)
        return [..._layers]
}

export function Controller(props: Props) {
        initialize()
        useSyncExternalStore(sub, get, get)
        return useState(() =>
                _(_Controller, {
                        plugin: _(Plugins),
                        layers: _(Layers),
                        ...props,
                })
        )[0] as unknown as React.ReactNode
}
