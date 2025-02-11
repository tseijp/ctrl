'use client'

import Container from '../clients/Container'
import { HTMLNode } from '../helpers/node'
import Bool from './Bool'
import Char from './Char'
import Color from './Color'
import Float from './Float'
import Null from './Null'
import Vector from './Vector'
import { ctrl, is } from '../index'
import { Attach, isColor, isHex, isVector, Target } from '../types'

export function Plugin<T extends Target>(props: Attach<unknown, T>) {
        const { a, k } = props
        const _ = ctrl.create

        if (typeof a === 'object') {
                if (isColor(a)) return _(Color<T>, props)
                if (isVector(a)) return _(Vector<T>, props)
        }

        if (is.str(a)) {
                if (isHex(a)) return _(Color<T>, props)
                return _(Char<T>, props)
        }

        if (is.nul(a)) return _(Null<T>, props)
        if (is.bol(a)) return _(Bool<T>, props)
        if (is.num(a)) return _(Float<T>, props)
        if (is.arr(a)) return _(Vector<T>, props)
        console.log(`ctrl Warn: not support`, k, a)
        return _(Null<T>, props, 'not support')
}

let isInit = 0

export const init = () => {
        if (is.str(ctrl.parent))
                ctrl.parent = document.getElementById(ctrl.parent)
        if (ctrl.parent) return
        ctrl.parent = ctrl.create(Container)
        ctrl.render(ctrl.parent, document.body)
}

export const mount = (el?: HTMLNode) => {
        if (!el) return
        if (!isInit++) init()
        ctrl.append(el, ctrl.parent!)
        return clean(el)
}

export const clean = (el?: HTMLNode) => () => {
        const p = ctrl.parent
        if (!p || is.str(p)) return
        if (!--isInit) ctrl.finish(p, document.body)
        if (!el || is.str(el)) return
        ctrl.remove(el, p)
}
