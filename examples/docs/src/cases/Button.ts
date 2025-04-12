import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        button0: { onclick: () => alert('CLICKED') }, // or
        button1: { value: { onclick: () => alert('CLICKED') } },
})

c.id = 'Button'

const code = () =>
        /* TS */ `
// Button
const c = ctrl({
        button0: { onclick: () => console.log('CLICKED') }, // or
        button1: { value: { onclick: () => console.log('CLICKED') } },
})
`.trim()

export default function ButtonCase() {
        const _ = ctrl.create

        const ref = (el: HTMLElement | null) => {
                if (!el) return
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
                        '### Button Cases'
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
