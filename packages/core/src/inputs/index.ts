'use client'

import Container from '../clients/Container'
import { HTMLNode } from '../helpers/node'
import Bool from './Bool'
import Char from './Char'
import Color from './Color'
import Float from './Float'
import Null from './Null'
import Vector from './Vector'
import { ctrl, Ctrl, is } from '../index'
import { isColor, isHex, isU, isVector, Target } from '../types'

export function attach<T extends Target>(c: Ctrl<T>, k: keyof T) {
        const { plugins, create: _ } = ctrl
        let a = c.current[k]
        if (isU<T[keyof T]>(a)) a = a.value

        if (typeof a === 'object') {
                for (const Plugin of plugins) {
                        const ret = _(Plugin, { key: k, a, c, k })
                        if (ret) return ret
                }
                if (isColor(a)) return _(Color<T>, { key: k, k, a, c })
                if (isVector(a)) return _(Vector<T>, { key: k, k, a, c })
        }

        if (is.str(a)) {
                if (isHex(a)) return _(Color<T>, { key: k, k, a, c })
                return _(Char<T>, { key: k, k, a, c })
        }

        if (is.nul(a)) return _(Null<T>, { key: k, k, a, c })
        if (is.bol(a)) return _(Bool<T>, { key: k, k, a, c })
        if (is.num(a)) return _(Float<T>, { key: k, k, a, c })
        if (is.arr(a)) return _(Vector<T>, { key: k, k, a, c })
        console.log(`ctrl Warn: not support`, k, a)
        return _(Null<T>, { key: k, k, a, c }, 'not support')
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
