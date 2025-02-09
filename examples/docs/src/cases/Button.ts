import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        button0: { onclick: () => console.log('CLICKED') }, // or
        button1: { onclick: () => console.log('CLICKED') }, // or
        button2: { value: { onclick: () => console.log('CLICKED') } }, // or
        button3: { value: { onclick: () => console.log('CLICKED') } }, // or
})

const code = () =>
        /* TS */ `
// Button
const c = ctrl({
        button0: { onclick: () => console.log('CLICKED') }, // or
        button1: document.querySelector('button'), // or
        button2: { value: { onclick: () => console.log('CLICKED') } }, // or
        button3: { value: document.querySelector('button') },
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
