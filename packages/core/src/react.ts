'use client'

// @ts-ignore
import React from 'react'
// @ts-ignore
import { createElement, useState, useSyncExternalStore } from 'react'
import _Controller from './clients/Controller'
import { Ctrl, ctrl, flush, isC, register } from './index'
import { PARENT_ID, Target } from './types'

export * from './index'

function useCtrl<T extends Target>(c: Ctrl<T>): T

function useCtrl<T extends Target>(config: T): T

function useCtrl<T extends Target>(config: T) {
        const [c] = useState(() => {
                if (isC(config)) return config
                return ctrl<T>(config)
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

const elements = new Set<React.ReactNode>()
const listeners = new Set<Function>()

let updated = 0

const get = () => updated

const sub = (update = () => {}) => {
        listeners.add(update)
        return () => {
                listeners.delete(update)
        }
}

function append(el: React.ReactNode) {
        updated++
        elements.add(el)
        flush(listeners)
}

function remove(el: React.ReactNode) {
        updated++
        elements.delete(el)
        flush(listeners)
}

function initialize() {
        if (isInitialized) return
        isInitialized = true
        register({
                parent: PARENT_ID,
                create: createElement,
                append,
                remove,
                finish() {},
        })
}

function Plugins() {
        useSyncExternalStore(sub, get, get)
        return [...elements]
}

export function Controller(props: Props) {
        initialize()
        useSyncExternalStore(sub, get, get)
        const _ = ctrl.create
        return useState(() =>
                _(_Controller, {
                        right: createElement(Plugins),
                        ...props,
                })
        )[0] as unknown as React.ReactNode
}
