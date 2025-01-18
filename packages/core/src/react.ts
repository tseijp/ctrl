'use client'

// @ts-ignore
import { createElement, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import _Controller from './clients/Controller'
import { ctrl, register } from './index'
import { Config } from './types'

export * from './index'

let isInitialized = false

function initialize() {
        if (isInitialized) return
        isInitialized = true
        register({
                parent: 'ctrl-container',
                create: createElement,
                append: createPortal,
        })
}

export function useCtrl<T extends Config>(config: T) {
        const c = useState(() => ctrl<T>(config))[0]
        useSyncExternalStore(c.sub, c.get, c.get)
        return c.current
}

interface Props {
        children: React.ReactNode
}

export function Controller(props: Props) {
        initialize()
        const { children } = props
        const _ = ctrl.create
        return _(_Controller, { children }) as unknown as React.ReactNode
}
