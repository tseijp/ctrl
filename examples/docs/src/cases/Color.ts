import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        color0: '#fff', // or
        color1: { value: '#fff' }, // or
        // @ts-ignore
        color2: { r: 1, g: 1, b: 1 }, // or
        // @ts-ignore
        color3: { h: 0, s: 0, l: 100 }, // or
        // @ts-ignore
        color4: { Y: 1, x: 1, y: 1 },
})

const code = () =>
        /* TS */ `
// Color
const c = ctrl({
        color0: ${JSON.stringify(c.current.color0)}, // or
        color1: ${JSON.stringify(c.current.color1)}, // or
        color2: ${JSON.stringify(c.current.color2)}, // @TODO SUPPORT
        color3: ${JSON.stringify(c.current.color3)}, // @TODO SUPPORT
        color4: ${JSON.stringify(c.current.color4)}, // @TODO SUPPORT
})
`.trim()

export default function ColorCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Color Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
