import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        select0: { options: ['#f00', '#0f0', '#00f'] }, // or
        select1: { options: ['#f00', '#0f0', '#00f'] }, // or
        select2: { options: ['#f00', '#0f0', '#00f'] }, // or
        select3: { value: { options: ['#f00', '#0f0', '#00f'] } }, // or
        select4: { value: { options: ['#f00', '#0f0', '#00f'] } }, // or
        select5: { value: { options: ['#f00', '#0f0', '#00f'] } }, // or
})

c.id = 'Select'

const code = () =>
        /* TS */ `
// Select
const c = ctrl({
        select0: { options: ['#f00', '#0f0', '#00f'] }, // or
        select1: { options: document.querySelectorAll('option') }, // or
        select2: document.querySelector('select'), // or
        select3: { value: { options: ['#f00', '#0f0', '#00f'] } }, // or
        select4: { value: { options: document.querySelectorAll('option') } }, // or
        select5: { value: document.querySelector('select') },
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
                [
                        _(
                                'h3',
                                {
                                        key: '0', //
                                        className: 'font-bold mb-4',
                                },
                                '### Select Cases'
                        ),
                        _('div', {
                                key: '1', //
                                ref,
                        }),
                ]
        )
}
