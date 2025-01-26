'use client'

// @ts-ignore
import { createElement, useState, useSyncExternalStore } from 'react'
import _Controller from './clients/Controller'
import { ctrl, flush, register } from './index'
import { Config } from './types'

export * from './index'

export function useCtrl<T extends Config>(config: T) {
        const c = useState(() => ctrl<T>(config))[0]
        useSyncExternalStore(c.sub, c.get, c.get)
        return c.current
}

interface Props {
        left?: React.ReactNode
        right?: React.ReactNode
        children: React.ReactNode
}

let isInitialized = false

const elements = [] as React.ReactNode[]
const listeners = new Set<Function>()

let updated = 0

const sub = (update = () => {}) => {
        listeners.add(update)
        return () => {
                listeners.delete(update)
        }
}

const get = () => updated

function append(el: React.ReactNode) {
        updated++
        elements.push(el)
        flush(listeners)
}

function initialize() {
        if (isInitialized) return
        isInitialized = true
        register({
                parent: 'ctrl-container',
                create: createElement,
                append,
        })
}

export function Controller(props: Props) {
        initialize()
        useSyncExternalStore(sub, get, get)
        const _ = ctrl.create
        return _(_Controller, {
                right: elements,
                ...props,
        }) as unknown as React.ReactNode
}
