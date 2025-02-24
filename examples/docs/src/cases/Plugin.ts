import { ctrl, cssPlugin } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

ctrl.use(cssPlugin)

const c = ctrl({
        cssPlugin0: { style: 'width:1280px; height:800px;' }, // or
        cssPlugin1: { style: { width: '1280px', height: '800px' } }, // or
        cssPlugin2: { value: { style: 'width:1280px; height:800px;' } }, // or
        cssPlugin3: { value: { style: { width: '1280px', height: '800px' } } },
})

c.id = 'Plugin'

const code = () =>
        /* TS */ `
import { ctrl, cssPlugin, htmlPlugin } from '@tsei/ctrl'

ctrl.use(cssPlugin, htmlPlugin)

const c = ctrl({
        cssPlugin0: ${JSON.stringify(c.current.cssPlugin0)}, // or
        cssPlugin1: ${JSON.stringify(c.current.cssPlugin1)}, // or
        cssPlugin2: ${JSON.stringify(c.current.cssPlugin2)}, // or
        cssPlugin3: ${JSON.stringify(c.current.cssPlugin3)},
}
`.trim()

export default function PluginCase() {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = codemirror(el, code)
                setTimeout(() => c.sub(update))
        }

        return _(
                'div',
                {
                        ref: scrollTo(c.id), //
                        className: 'p-4 bg-white rounded',
                },
                [
                        _(
                                'h3',
                                {
                                        key: '0', //
                                        className: 'font-bold mb-4',
                                },
                                '### CSS Plugin'
                        ),
                        _('div', {
                                key: '1', //
                                // ref,
                        }),
                ]
        )
}
