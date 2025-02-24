import Bool from './Bool'
import Char from './Char'
import Color from './Color'
import Float from './Float'
import Null from './Null'
import Vector from './Vector'
import Container from '../clients/Container'
import { Ctrl, ctrl, HTMLNode, is } from '../index'
import { Attach, isColor, isHex, isU, isVector, Target } from '../types'

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
                const child = ctrl(a, `${c.id}.${k}`)
                child.parent = c
                c.mounts.add(child.mount)
                c.cleanups.add(child.clean)
                return _(PluginItem, { c: child })
        }

        if (is.arr(a)) {
                if (a.every(is.num)) return _(Vector<T>, props)
                const child = ctrl(a, `${c.id}.${k}`)
                child.parent = c
                c.mounts.add(child.mount)
                c.cleanups.add(child.clean)
                return _(PluginItem, { c: child })
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
        const _ = ctrl.create

        const attach = <K extends keyof T & string>(k: K) => {
                let a = current[k]
                if (isU(a)) a = a.value
                for (const El of ctrl.plugin) {
                        const el = _(El, { key: k, a, c, k })
                        if (el) return children.push(el)
                }
        }

        for (const k in current) attach(k)
        return _(Container, { title: id, id }, children)
}
