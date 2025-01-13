import { is, merge, Merge } from './utils'

export type HTMLTag = keyof HTMLElementTagNameMap
export type HTMLEl<T extends HTMLTag> = HTMLElementTagNameMap[T]
export type HTMLNode<T extends HTMLTag = HTMLTag> = HTMLEl<T> | string | null

type Props<T extends HTMLTag> = {
        key?: string
        ref?: (el: HTMLEl<T>) => void
        children?: HTMLNode | HTMLNode[]
}

export function append<El extends Node>(child: Node | string | null, el: El) {
        if (is.str(child)) child = document.createTextNode(child)
        if (!is.nul(child)) el.appendChild(child)
}

function create<T extends HTMLTag>(
        type: T,
        props?: Props<T> & Merge<HTMLEl<T>>,
        child?: HTMLNode | HTMLNode[]
): HTMLEl<T>

function create<T extends HTMLTag, P = {}, Child = HTMLEl<T>>(
        type: (props: P) => Child,
        props?: P,
        child?: HTMLNode | HTMLNode[]
): Child

function create(type: any, props: any = {}, child: HTMLNode | HTMLNode[] = []) {
        const { key, ref, children, ...other } = props ?? {}

        // coordinate props
        if (children) child = children
        if (!is.arr(child)) child = [child]
        if (is.fun(type)) {
                merge(props, { children: child })
                return type(props)
        }

        // create element
        const el = document.createElement(type)
        merge(el, other)

        child.forEach((c) => append(c, el))
        if (ref) ref(el)
        return el
}

export default create
