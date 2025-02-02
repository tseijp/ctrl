import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        // @ts-ignore
        select0: ['#f00', '#0f0', '#00f'], // or
        // @ts-ignore
        select1: { value: ['#f00', '#0f0', '#00f'] },
})

const code = () =>
        /* TS */ `
// Select
const c = ctrl({
        select0: ${JSON.stringify(c.current.select0)}, // @TODO SUPPORT
        select1: ${JSON.stringify(c.current.select1)}, // @TODO SUPPORT
})
`.trim()

export default function SelectCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Select Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
