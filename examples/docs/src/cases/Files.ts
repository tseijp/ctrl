import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        files0: { src: '.pdf' }, // or
        files1: { value: { src: '.pdf' } },
})

c.id = 'Files'

const code = () =>
        /* TS */ `
// Files
const c = ctrl({
        file0: ${JSON.stringify(c.current.files0)}, // or
        file1: ${JSON.stringify(c.current.files1)},
})
`.trim()

export default function FilesCase() {
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
                                '### Files Cases'
                        ),
                        _('div', {
                                key: '1', //
                                ref,
                        }),
                ]
        )
}
