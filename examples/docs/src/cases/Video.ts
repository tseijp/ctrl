import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        video0: { src: '.webm' }, // or
        video1: { value: { src: '.webm' } },
})

c.id = 'Video'

const code = () =>
        /* TS */ `
// Video
const c = ctrl({
        video0: ${JSON.stringify(c.current.video0)}, // or
        video1: ${JSON.stringify(c.current.video1)},
})
`.trim()

export default function VideoCase() {
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
                        '### Video Cases'
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
