import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        number0: 0, // or
        number1: { value: 1 },
})

c.id = 'Number'

const code = () =>
        /* TS */ `
// Number
const c = ctrl({
        number0: ${JSON.stringify(c.current.number0)}, // or
        number1: ${JSON.stringify(c.current.number1)}
})
`.trim()

export default function NumberCase() {
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
                        '### Number Cases'
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
