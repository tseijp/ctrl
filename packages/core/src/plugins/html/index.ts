import { ctrl } from '../../index'
import { Attach } from '../../types'
import { PluginItem } from '../index'

const isHTML = (a: unknown): a is HTMLElement => {
        return a instanceof HTMLElement
}

export function htmlPlugin(props: Attach<HTMLElement>) {
        const { a, k } = props
        if (!isHTML(a)) return null
        const _ = ctrl.create
        const c = ctrl(a, k)
        return _(PluginItem, { c, ref: c.mount })
}
