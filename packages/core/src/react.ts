'use client'

// @ts-ignore
import { createElement as _, useState, useSyncExternalStore } from 'react'
import _Controller from './clients/Controller'
import LayersItem from './clients/LayersItem'
import { PluginItem } from './plugins/index'
import { Ctrl, ctrl, flush, isC, register } from './index'
import { Target } from './types'

export * from './index'
export default useCtrl
export { useCtrl }

function useCtrl<T extends Target>(config: T | Ctrl<T>, id?: string) {
        const [c] = useState<Ctrl<T>>(() => {
                if (isC(config)) return config
                return ctrl<T>(config, id)
        })
        useSyncExternalStore(c.sub, c.get, c.get)
        return c.current as T
}

const controlls = new Set<Ctrl>()
const listeners = new Set<Function>()

const get = () => controlls.size

const sub = (update = () => {}) => {
        listeners.add(update)
        return () => {
                listeners.delete(update)
        }
}

function Plugins() {
        useSyncExternalStore(sub, get, get) // @ts-ignore
        return [...controlls].map((c: Ctrl) => _(PluginItem, { c, key: c.id }))
}

function Layers() {
        useSyncExternalStore(sub, get, get)
        if (!ctrl.layersParent) return null // @ts-ignore
        return [...controlls].map((c: Ctrl) => _(LayersItem, { c, key: c.id }))
}

function mount(c: Ctrl) {
        controlls.add(c)
        flush(listeners)
}

let isInitialized = false

function initialize() {
        if (isInitialized) return
        isInitialized = true
        register({ mount, create: _ })
}

interface Props extends React.HTMLProps<HTMLDivElement> {
        left?: React.ReactNode
        right?: React.ReactNode
}

export function Controller(props: Props) {
        initialize()
        useSyncExternalStore(sub, get, get)
        return useState(() =>
                // @ts-ignore
                _(_Controller, {
                        plugin: _(Plugins),
                        layers: _(Layers),
                        ...props,
                })
        )[0] as unknown as React.ReactNode
}
