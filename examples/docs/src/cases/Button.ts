import { ctrl } from '@tsei/ctrl/src/index'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        button0: { onclick: () => console.log('CLICKED') }, // or
        button1: { onclick: () => console.log('CLICKED') }, // or
        button2: { value: { onclick: () => console.log('CLICKED') } }, // or
        button3: { value: { onclick: () => console.log('CLICKED') } }, // or
})

c.id = 'Button'

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

export default function ButtonCase() {
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
                                { className: 'font-bold mb-4' },
                                '### Button Cases'
                        ),
                        _('div', { ref }),
                ]
        )
}
