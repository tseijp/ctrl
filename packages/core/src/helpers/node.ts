import { is, merge, Merge } from './utils'

export type TagName = keyof HTMLElementTagNameMap
export type HTMLEl<T extends TagName> = HTMLElementTagNameMap[T]
export type NodeEl = Element | null
export type FunEl = <T extends any>(props: T) => NodeEl

type BaseProps = {
        key?: string
        ref?: (el: any) => void
}

export type Props<T extends TagName> = Merge<HTMLEl<T>> & BaseProps

export function append<El extends Node>(child: string | Node | null, el: El) {
        if (is.str(child)) child = document.createTextNode(child)
        if (!is.nul(child)) el.appendChild(child)
}

function create<T extends TagName>(
        type: T,
        props?: Props<T>,
        children?: NodeEl | NodeEl[]
): NodeEl

function create(
        type: FunEl,
        props?: BaseProps,
        children?: NodeEl | NodeEl[]
): NodeEl

function create<T extends TagName>(
        type: T | FunEl,
        props: any = {},
        children: NodeEl | NodeEl[] = []
) {
        const { key, ref, ...other } = props
        if (is.fun(type)) return type(props)

        const el = document.createElement(type)
        merge(el, other as HTMLEl<T>)
        ref?.(el)

        if (!is.arr(children)) children = [children]
        children.forEach((child) => append(child, el))

        return el
}

export default create
