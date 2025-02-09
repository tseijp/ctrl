import { ctrl, type Props } from '@tsei/ctrl/src/index'

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

export default function StringCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### String Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
