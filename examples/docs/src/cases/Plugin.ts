import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        css0: { style: 'width:1280px; height:800px;' }, // or
        css1: { style: { width: '1280px', height: '800px' } }, // or
        css2: { value: { style: 'width:1280px; height:800px;' } }, // or
        css3: { value: { style: { width: '1280px', height: '800px' } } },
})

c.id = 'Plugin'

const code = () =>
        /* TS */ `
const c = ctrl({
        css0: ${JSON.stringify(c.current.css0)}, // or
        css1: ${JSON.stringify(c.current.css1)}, // or
        css2: ${JSON.stringify(c.current.css2)}, // or
        css3: ${JSON.stringify(c.current.css3)},
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
                _(
                        'h3',
                        {
                                key: '0', //
                                className: 'font-bold mb-4',
                        },
                        '### CSS Plugin'
                ),
                _(
                        'div', //
                        {
                                key: '1', //
                                ref,
                        }
                )
        )
}
