import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        audio0: { src: '.wav' }, // or
        audio1: { value: { src: '.wav' } },
})

c.id = 'Audio'

const code = () =>
        /* TS */ `
// Audio
const c = ctrl({
        audio0: ${JSON.stringify(c.current.audio0)}, // or
        audio1: ${JSON.stringify(c.current.audio1)},
})
`.trim()

export default function AudioCase() {
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
                                '### Audio Cases'
                        ),
                        _('div', {
                                key: '1', //
                                ref,
                        }),
                ]
        )
}
