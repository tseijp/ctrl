import { css2js, js2css, str2px } from './utils'
import { ctrl, is } from '../../index'
import { Attach } from '../../types'
import { InputValue } from '../../clients/InputValue'
import InputLabel from '../../clients/InputLabel'

type CSSStyle = { style: string | CSSStyleDeclaration }

const isCSS = (a: unknown): a is CSSStyle => {
        if (!a) return false
        if (!is.obj(a)) return false
        if ('style' in a) {
                if (is.obj(a.style)) return true
                if (is.str(a.style)) return true
        }
        return false
}

export default function CSS(props: Attach<CSSStyle>) {
        const { a, c, k } = props
        if (!isCSS(a)) return null
        const style = is.str(a.style) ? css2js(a.style) : a.style

        const _ = ctrl.create
        const children = []

        children.push(_(InputLabel, { key: 'key', k }))

        for (const key in style) {
                const px = str2px(style[key])
                if (!px) return null

                const _set = (x: number) => {
                        style[key] = `${x}${px[1]}`
                        a.style = is.str(a.style) ? js2css(style) : style
                        c.set(k, a)
                }

                children.push(
                        _('div', {}, [
                                _(InputLabel, { key: 'key', k: key }),
                                _(
                                        InputValue,
                                        {
                                                icon: key[0].toUpperCase(),
                                                value: px[0],
                                                _set,
                                        },
                                        key
                                ),
                        ])
                )
        }

        return _('fieldset', {}, children)
}

export { CSS }
