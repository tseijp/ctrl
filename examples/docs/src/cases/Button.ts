import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        // @ts-ignore
        button0: () => alert('CLICKED'), // or
        // @ts-ignore
        button1: { value: () => alert('CLICKED') },
})

const code = () =>
        /* TS */ `
// Button
const c = ctrl({
        button0: ${JSON.stringify(c.current.button0)}, // @TODO SUPPORT
        button1: ${JSON.stringify(c.current.button1)}, // @TODO SUPPORT
})
`.trim()

export default function ButtonCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Button Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
