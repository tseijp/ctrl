'use client'

// @ts-ignore
import React from 'react'
// @ts-ignore
import { createElement as _, useState, useSyncExternalStore } from 'react'
import _Controller from './clients/Controller'
import { Ctrl, ctrl, flush, isC, register } from './index'
import { Target } from './types'
import { Plugin } from './plugins/index'
import LayersItem from './clients/LayersItem'

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

interface Props {
        left?: React.ReactNode
        right?: React.ReactNode
        children: React.ReactNode
}

let isInitialized = false

const layersElements = new Set<React.ReactNode>()
const pluginElements = new Set<React.ReactNode>()
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
        updated++
        // elements.add(el)
        pluginElements.add(_(Plugin, { c, key: c.id }))
        layersElements.add(_(LayersItem, { id: c.id, key: c.id }))
        flush(listeners)
}

function clean(c: Ctrl) {
        updated++
        // elements.delete(el)
        flush(listeners)
}

function initialize() {
        if (isInitialized) return
        isInitialized = true
        register({ create: _, mount, clean })
}

function Plugins() {
        useSyncExternalStore(sub, get, get)
        return [...pluginElements]
}

function Layers() {
        useSyncExternalStore(sub, get, get)
        const _ = ctrl.create
        return [...layersElements]
}

export function Controller(props: Props) {
        initialize()
        useSyncExternalStore(sub, get, get)
        return useState(() =>
                _(_Controller, {
                        right: _(Plugins),
                        layers: _(Layers),
                        ...props,
                })
        )[0] as unknown as React.ReactNode
}
