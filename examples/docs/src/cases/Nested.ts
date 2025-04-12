import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        nested0: { a: { b: { c: 0 } } }, // or
        nested1: { value: { a: { b: { c: 0 } } } }, // or
        nested2: { array: [0, 1, [2, 3]] }, // or
        nested3: { value: { array: [0, 1, [2, 3]] } },
})

c.id = 'Nested'

const code = () =>
        /* TS */ `
// Nested
const c = ctrl({
        nested0: ${JSON.stringify(c.current.nested0)}, // or
        nested1: ${JSON.stringify(c.current.nested1)}, // or
        nested2: ${JSON.stringify(c.current.nested2)}, // or
        nested3: ${JSON.stringify(c.current.nested3)},
})
`.trim()

export default function NestedCase() {
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
                        '### Nested Cases'
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
