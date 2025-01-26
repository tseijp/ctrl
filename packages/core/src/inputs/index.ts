import Container from '../clients/Container'
import { HTMLNode } from '../helpers/node'
import Bool from './Bool'
import Char from './Char'
import Float from './Float'
import Vector from './Vector'
import { ctrl, Ctrl, is, isU } from '../index'
import { Config } from '../types'

export function attach<T extends Config>(c: Ctrl<T>, k: keyof T) {
        const _ = ctrl.create
        let a = c.current[k]
        if (isU<T[keyof T]>(a)) a = a.value
        if (is.bol(a)) return _(Bool<T>, { key: k, k, a, c })
        if (is.str(a)) return _(Char<T>, { key: k, k, a, c })
        if (is.num(a)) return _(Float<T>, { key: k, k, a, c })
        if (is.arr(a)) return _(Vector<T>, { key: k, k, a, c })
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
