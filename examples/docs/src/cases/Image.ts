import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        image0: { src: 'https://r.tsei.jp/block.png' }, // or
        image1: { src: 'https://r.tsei.jp/block.png' }, // or
        image2: { value: { src: 'https://r.tsei.jp/block.png' } }, // or
        image3: { value: { src: 'https://r.tsei.jp/block.png' } }, // or
})

c.id = 'Image'

const code = () =>
        /* TS */ `
// Image
const c = ctrl({
        image0: ${JSON.stringify(c.current.image0)}, // or
        image1: ${JSON.stringify(c.current.image1)}, // or
        image2: ${JSON.stringify(c.current.image2)}, // or
        image3: ${JSON.stringify(c.current.image3)},
})
`.trim()

export default function ImageCase() {
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
                                '### Image Cases'
                        ),
                        _('div', {
                                key: '1', //
                                ref,
                        }),
                ]
        )
}
