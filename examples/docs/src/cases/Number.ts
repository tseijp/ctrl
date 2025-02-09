import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        number0: 0, // or
        number1: { value: 1 },
})

const code = () =>
        /* TS */ `
// Number
const c = ctrl({
        number0: ${JSON.stringify(c.current.number0)}, // or
        number1: ${JSON.stringify(c.current.number1)}
})
`.trim()

export default function NumberCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Number Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
