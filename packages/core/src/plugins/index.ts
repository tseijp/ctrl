import HTML, { isHTML, isHTMLCollection } from './html/index'
import Bool from './Bool'
import Char from './Char'
import Color from './Color'
import Float from './Float'
import Image from './Image'
import Null from './Null'
import Select from './Select'
import Vector from './Vector'
import Container from '../clients/Container'
import { Ctrl, ctrl, HTMLNode, is } from '../index'
import {
        Attach,
        isColor,
        isHex,
        isImage,
        isSelect,
        isU,
        isVector,
        Target,
} from '../types'

interface Props<T extends Target> {
        c: Ctrl<T>
}

function isIgnore(key: string) {
        if (key.startsWith('_')) return true
        if (key.startsWith('on')) return true
        if (key.startsWith('parent')) return true
        return false
}

export function PluginItem<T extends Target>(props: Props<T>) {
        const { c } = props
        const { current, id } = c
        const children = [] as HTMLNode[]
        const _ = ctrl.create

        const attach = <K extends keyof T & string>(k: K) => {
                let a = current[k]
                if (isU(a)) a = a.value
                if (isIgnore(k)) return
                for (const El of ctrl.plugin) {
                        const el = _(El, { key: k, a, c, k })
                        if (el) return children.push(el)
                }
        }

        for (const k in current) attach(k)
        return _(Container, { title: id, id }, children)
}

export function NestedItem<T extends Target>(props: Attach<unknown, T>) {
        const { a, c, k } = props
        const child = ctrl(a, `${c.id}.${k}`)
        const _ = ctrl.create

        // register
        child.parent = c
        c.mounts.add(child.mount)
        c.cleanups.add(child.clean)

        return _(PluginItem, { c: child })
}

export function DefaultPlugin<T extends Target>(props: Attach<unknown, T>) {
        const { a, k } = props
        const _ = ctrl.create

        if (isHTMLCollection(a)) return _(NestedItem, props)

        if (typeof a === 'object') {
                if (isHTML(a)) return _(HTML, props)
                if (isColor(a)) return _(Color, props)
                if (isImage(a)) return _(Image, props)
                if (isSelect(a)) return _(Select, props)
                if (isVector(a)) return _(Vector, props)
        }

        if (is.obj(a)) return _(NestedItem, props)

        if (is.arr(a)) {
                if (a.every(is.num)) return _(Vector, props)
                return _(NestedItem, props)
        }

        if (is.str(a)) {
                if (isHex(a)) return _(Color<T>, props)
                return _(Char<T>, props)
        }

        if (is.nul(a)) return _(Null, props)
        if (is.bol(a)) return _(Bool, props)
        if (is.num(a)) return _(Float, props)

        console.log(`ctrl Warn: not support`, k, a)

        return _(Null<T>, props, 'not support')
}
