import { is, merge, Merge } from './utils'

export type HTMLMap = HTMLElementTagNameMap
export type HTMLTag = keyof HTMLMap
export type HTMLNode<T extends HTMLTag = HTMLTag> = HTMLMap[T] | string | null

type Props<T extends HTMLTag> = {
        key?: string
        ref?: (el: HTMLMap[T]) => void
        children?: HTMLNode | HTMLNode[]
}

export function append<El extends Node>(child: Node | string | null, el: El) {
        if (is.str(child)) child = document.createTextNode(child)
        if (!is.nul(child)) el.appendChild(child)
}

export function remove<El extends Node>(child: Node, el: El) {
        el.removeChild(child)
}

function create<T extends HTMLTag>(
        type: T,
        props?: Props<T> & Merge<HTMLMap[T]>,
        child?: HTMLNode | HTMLNode[]
): HTMLMap[T]

function create<T extends HTMLTag, P = {}, Child = HTMLMap[T]>(
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

export { create }

export default create
