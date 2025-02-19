'use client'

import Bool from './Bool'
import Char from './Char'
import Color from './Color'
import Float from './Float'
import Null from './Null'
import Vector from './Vector'
import { Ctrl, ctrl, HTMLNode, is } from '../index'
import { Attach, isColor, isHex, isU, isVector, Target } from '../types'
import Container from '../clients/Container'

export * from './css/index'
export * from './html/index'

export function DefaultPlugin<T extends Target>(props: Attach<unknown, T>) {
        const { a, c, k } = props
        const _ = ctrl.create

        if (typeof a === 'object') {
                if (isColor(a)) return _(Color<T>, props)
                if (isVector(a)) return _(Vector<T>, props)
        }

        if (is.obj(a)) {
                const next = ctrl(a, k)
                next.parent = c
                return _(PluginItem, { c: next })
        }

        if (is.arr(a)) {
                // @TODO NEST
                // const next = ctrl(a, k)
                // next.parent = c
                return _(Vector<T>, props)
        }

        if (is.str(a)) {
                if (isHex(a)) return _(Color<T>, props)
                return _(Char<T>, props)
        }

        if (is.nul(a)) return _(Null<T>, props)
        if (is.bol(a)) return _(Bool<T>, props)
        if (is.num(a)) return _(Float<T>, props)

        console.log(`ctrl Warn: not support`, k, a)

        return _(Null<T>, props, 'not support')
}

interface Props<T extends Target> {
        c: Ctrl<T>
}

export function PluginItem<T extends Target>(props: Props<T>) {
        const { c } = props
        const { current, id } = c
        const children = [] as HTMLNode[]

        const attach = <K extends keyof T & string>(k: K) => {
                let a = current[k]
                if (isU(a)) a = a.value
                for (const El of ctrl.plugin) {
                        const el = ctrl.create(El, { key: k, a, c, k })
                        if (el) return children.push(el)
                }
        }

        for (const k in current) attach(k)
        const _ = ctrl.create
        return _(Container, { title: id, id }, children)
}
