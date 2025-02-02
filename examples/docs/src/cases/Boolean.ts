import { ctrl, type Props } from '@tsei/ctrl/src/index'

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

export default function BooleanCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Boolean Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
