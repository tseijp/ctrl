import { css2js, js2css, str2px } from './utils'
import { is } from '../../helpers/utils'
import ctrl from '../../index'
import { Plugins } from '../../types'
import { InputValue } from '../../clients/InputValue'

type CSS = { style: string | object }

const isCSS = (a: object): a is CSS => {
        if ('style' in a) {
                if (is.obj(a.style)) return true
                if (is.str(a.style)) return true
        }
        return false
}

const css: Plugins<CSS> = (props) => {
        const { a, c, k } = props
        if (!isCSS(a)) return null
        let style = a.style
        if (is.str(a.style)) style = css2js(a.style)

        const _ = ctrl.create
        const children = []

        children.push(
                _(
                        'div',
                        {
                                key: 'key',
                                className: 'text-[10px] leading-[14px] mt-1',
                        },
                        k as string
                )
        )

        for (const key in style) {
                const px = str2px(style[key])
                if (!px) return null
                const _set = (x: number) => {
                        style[key] = `${x}${px[1]}`
                        let next = style
                        if (is.str(a.style)) next = js2css(style)
                        a.style = next
                        c.set(k, a)
                }

                children.push(
                        _('div', {}, [
                                _(
                                        'div',
                                        {
                                                key: 'key',
                                                className: 'text-[10px] leading-[14px] mt-1',
                                        },
                                        key
                                ),
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

        return _('div', {}, children)
}

export { css }

export default css
