import { each, is, merge, Merge } from './utils'

export type HTMLMap = HTMLElementTagNameMap
export type HTMLTag = keyof HTMLMap
export type HTMLNode<T extends HTMLTag = HTMLTag> = HTMLMap[T] | string | null
export type Component<T extends HTMLTag, P = {}, Child = HTMLMap[T]> = (
        props: P
) => Child

export type Props<T extends HTMLTag> = Merge<HTMLMap[T]> & {
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
        props?: Props<T>,
        child?: HTMLNode | HTMLNode[]
): HTMLMap[T]

function create<T extends HTMLTag, P = {}, Child = HTMLMap[T]>(
        type: Component<T, P, Child>,
        props?: P,
        child?: HTMLNode | HTMLNode[]
): Child

function create(type: any, props: any = {}, child: HTMLNode | HTMLNode[] = []) {
        let { key, ref, children = [], ...other } = props ?? {}

        // coordinate children
        if (!is.arr(children)) children = [children]
        if (!is.arr(child)) child = [child]
        child = [...children, ...child]

        // render component
        if (is.fun(type)) {
                merge(props, { children: child })
                return type(props)
        }

        // create element
        const el = document.createElement(type)
        merge(el, other)
        each(child, (c) => append(c, el))

        if (ref) ref(el)
        return el
}

export { create }

export default create
