import { ctrl } from '@tsei/ctrl/src/index'
import { codemirror } from '../utils'

const c = ctrl({
        string0: 'HELLO', // or
        string1: { value: 'WORLD' },
})

const code = () =>
        /* TS */ `
// String
const c = ctrl({
        string0: ${JSON.stringify(c.current.string0)}, // or
        string1: ${JSON.stringify(c.current.string1)},
})
`.trim()

export default function StringCase() {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = codemirror(el, code)
                setTimeout(() => c.sub(update))
        }

        return _('div', { className: 'p-4 bg-white rounded' }, [
                _('h3', { className: 'font-bold mb-4' }, '### String Cases'),
                _('div', { ref }),
        ])
}
