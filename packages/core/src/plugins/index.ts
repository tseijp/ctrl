import HTML, { isHTML, isHTMLCollection } from './html/index'
import { CSS, isCSS } from './css/index'
import Audio from './Audio'
import Bool from './Bool'
import Char from './Char'
import Color from './Color'
import Float from './Float'
import Image from './Image'
import Nested from './Nested'
import Null from './Null'
import Select from './Select'
import Vector from './Vector'
import Video from './Video'
import Container from '../clients/Container'
import { Ctrl, ctrl, HTMLNode, is } from '../index'
import {
        Attach,
        isAudio,
        isButton,
        isColor,
        isFiles,
        isHex,
        isImage,
        isSelect,
        isU,
        isVector,
        isVideo,
        Target,
} from '../types'
import Button from './Button'
import Files from './Files'

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
                const el = _(DefaultPlugin, { key: k, a, c, k })
                if (el) return children.push(el)
        }

        for (const k in current) attach(k)
        return _(Container, { title: id, id }, children)
}

export function DefaultPlugin<T extends Target>(props: Attach<unknown, T>) {
        const { a, k } = props
        const _ = ctrl.create

        for (const plugin of ctrl.plugin)
                if (plugin.is(a)) return _(plugin.el, props)

        if (isHTMLCollection(a)) return _(Nested, props)

        if (typeof a === 'object') {
                if (isColor(a)) return _(Color, props)
                if (isSelect(a)) return _(Select, props)
                if (isVector(a)) return _(Vector, props)
                // Audio, Image, Video, ... or etc
                if (isImage(a)) return _(Image, props)
                if (isAudio(a)) return _(Audio, props)
                if (isVideo(a)) return _(Video, props)
                if (isFiles(a)) return _(Files, props)
                // html, css
                if (isButton(a)) return _(Button, props)
                if (isCSS(a)) return _(CSS, props)
                if (isHTML(a)) return _(HTML, props)
        }

        if (is.obj(a)) return _(Nested, props)

        if (is.arr(a)) {
                if (a.every(is.num)) return _(Vector, props)
                return _(Nested, props)
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
