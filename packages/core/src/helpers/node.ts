import { each, is, merge, Merge } from './utils'

export type HTMLMap = HTMLElementTagNameMap
export type HTMLTag = keyof HTMLMap
export type HTMLNode<T extends HTMLTag = HTMLTag> =
        | HTMLMap[T]
        | string
        | number
        | null
        | undefined

export type Component<T extends HTMLTag, P = {}, Child = HTMLMap[T]> = (
        props: P
) => Child

export type Props<T extends HTMLTag> = Merge<HTMLMap[T]> & {
        key?: string
        ref?: (el: HTMLMap[T]) => void
        children?: HTMLNode | HTMLNode[]
}

export function append<El extends Node>(
        child: Node | string | number | null | undefined,
        el: El
) {
        if (is.num(child)) child = child.toString()
        if (is.str(child)) child = document.createTextNode(child)
        if (child) el.appendChild(child)
}

export function remove<El extends Node>(child: Node, el: El) {
        el.removeChild(child)
}

function create<T extends HTMLTag>(
        type: T,
        props?: Props<T>,
        ...args: HTMLNode[]
): HTMLMap[T]

function create<T extends HTMLTag, P = {}, Child = HTMLMap[T]>(
        type: Component<T, P, Child>,
        props?: P,
        ...args: HTMLNode[]
): Child

function create(type: any, props: any, ...args: HTMLNode[]) {
        if (!props) props = {}
        const { key, ref, children, ...other } = props

        // coordinate children
        if (!args.length) args = is.arr(children) ? children : [children]

        // render component
        if (is.fun(type)) {
                merge(props, { children: args })
                return type(props)
        }

        // create element
        const el = document.createElement(type)
        merge(el, other)
        each(args.flat(), (c) => append(c, el))

        if (ref) ref(el)
        return el
}

export { create }

export default create
