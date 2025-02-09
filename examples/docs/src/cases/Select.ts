import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        select0: { options: ['#f00', '#0f0', '#00f'] }, // or
        select1: { options: document.querySelectorAll('option') }, // or
        select2: document.querySelector('select'), // or
        select3: { value: { options: ['#f00', '#0f0', '#00f'] } }, // or
        select4: { value: { options: document.querySelectorAll('option') } }, // or
        select5: { value: document.querySelector('select') },
})

const code = () =>
        /* TS */ `
// Select
const c = ctrl({
        select0: { options: ['#f00', '#0f0', '#00f'] }, // or
        select1: { options: document.querySelectorAll('option') }, // or
        select2: document.querySelector('select'), // or
        select3: { value: { options: ['#f00', '#0f0', '#00f'] } }, // or
        select4: { value: { options: document.querySelectorAll('option') } }, // or
        select5: { value: document.querySelector('select') },
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
