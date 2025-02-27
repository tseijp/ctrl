import { ctrl, is, NestedItem } from '../../index'
import { Attach, Target } from '../../types'

const isNumeric = (a: unknown) => {
        if (!is.str(a)) return false
        if (a.length === 0) return false

        for (let i = 0; i < a.length; i++) {
                const charCode = a.charCodeAt(i)
                if (charCode < 48 || charCode > 57) return false
        }

        return true
}

export const isHTMLCollection = (a: unknown): a is HTMLCollection => {
        if (a instanceof HTMLCollection) return true
        return false
}

export const isHTML = (a: unknown): a is HTMLElement => {
        if (a instanceof HTMLElement) return true
        if (a instanceof HTMLDocument) return true
        if (a instanceof HTMLBodyElement) return true
        return false
}

export default function HTML<T extends Target>(props: Attach<HTMLElement, T>) {
        const { a, k, c } = props

        if (!isHTML(a)) return null
        if (!isNumeric(k)) return null

        const _ = ctrl.create
        return _(NestedItem, { a, c, k: a.nodeName })
}
