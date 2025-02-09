import { ctrl } from '@tsei/ctrl/src/index'
import { codemirror } from '../utils'

const c = ctrl({
        boolean0: true, // or
        boolean1: { value: false },
})

const code = () =>
        /* TS */ `
// Boolean
const c = ctrl({
        boolean0: ${JSON.stringify(c.current.boolean0)}, // or
        boolean1: ${JSON.stringify(c.current.boolean1)},
})
`.trim()

export default function BooleanCase() {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = codemirror(el, code)
                setTimeout(() => c.sub(update))
        }

        return _('div', { className: 'p-4 bg-white rounded' }, [
                _('h3', { className: 'font-bold mb-4' }, '### Boolean Cases'),
                _('div', { ref }),
        ])
}
