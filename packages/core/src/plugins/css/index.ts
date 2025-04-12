import { css2js } from './utils'
import { ctrl, is } from '../../index'
import { Attach } from '../../types'
import InputLabel from '../../clients/InputLabel'
import Nested from '../Nested'

type CSSStyle = { style: string | CSSStyleDeclaration }

export function isCSS(a: unknown): a is CSSStyle {
        if (!a) return false
        if (!is.obj(a)) return false
        if ('style' in a) {
                if (is.obj(a.style)) return true
                if (is.str(a.style)) return true
        }
        return false
}

export function CSS(props: Attach<CSSStyle>) {
        const { a, c, k } = props
        const style = is.str(a.style) ? css2js(a.style) : a.style
        const _ = ctrl.create
        return _(
                'fieldset',
                {
                        id: `${c.id}.${k}`,
                        className: 'mr-2',
                },
                _(
                        InputLabel, //
                        {
                                key: 'label', //
                                k,
                        }
                ),
                _(
                        Nested, //
                        {
                                key: 'nested', //
                                a: style,
                                c,
                                k,
                        }
                )
        )
}
