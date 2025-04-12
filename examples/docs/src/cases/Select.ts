import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        select0: { options: ['#f00', '#0f0', '#00f'] }, // or
        select1: { value: { options: ['#f00', '#0f0', '#00f'] } },
})

c.id = 'Select'

const code = () =>
        /* TS */ `
// Select
const c = ctrl({
        select0: { options: ${JSON.stringify(c.current.select0)} }, // or
        select1: { value: { options: ${JSON.stringify(c.current.select1)} } },
})
`.trim()

export default function SelectCase() {
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
                        '### Select Cases'
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
