import { is, merge, Merge } from './utils'

export type HTMLTag = keyof HTMLElementTagNameMap
export type HTMLEl<T extends HTMLTag> = HTMLElementTagNameMap[T]
export type HTMLNode = Element | string | null
export type HTMLComponent<P = {}> = (props: P) => HTMLNode

type Props = {
        key?: string
        ref?: (el: any) => void
        children?: HTMLNode | HTMLNode[]
}

export function append<El extends Node>(child: string | Node | null, el: El) {
        if (is.str(child)) child = document.createTextNode(child)
        if (!is.nul(child)) el.appendChild(child)
}

function create<T extends HTMLTag>(
        type: T,
        props?: Props & Merge<HTMLEl<T>>,
        child?: HTMLNode | HTMLNode[]
): HTMLNode

function create<P = {}>(
        type: HTMLComponent<P>,
        props?: P,
        child?: HTMLNode | HTMLNode[]
): HTMLNode

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
        if (ref) ref(el)

        child.forEach((c) => append(c, el))

        return el
}

export default create
