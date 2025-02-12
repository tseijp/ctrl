import { ctrl } from '@tsei/ctrl/src/index'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({
        color0: '#fff', // or
        color1: { r: 1, g: 1, b: 1 }, // or
        color2: { h: 0, s: 0, l: 100 }, // or
        color3: { Y: 1, x: 1, y: 1 }, // or
        color4: { value: '#fff' }, // or
        color5: { value: { r: 1, g: 1, b: 1 } }, // or
        color6: { value: { h: 0, s: 0, l: 100 } }, // or
        color7: { value: { Y: 1, x: 1, y: 1 } },
})

c.id = 'Color'

const code = () =>
        /* TS */ `
// Color
const c = ctrl({
        color0: ${JSON.stringify(c.current.color0)}, // or
        color1: ${JSON.stringify(c.current.color1)}, // or
        color2: ${JSON.stringify(c.current.color2)}, // or
        color3: ${JSON.stringify(c.current.color3)}, // or
        color4: ${JSON.stringify(c.current.color4)}, // or
        color5: ${JSON.stringify(c.current.color5)}, // or
        color6: ${JSON.stringify(c.current.color6)}, // or
        color7: ${JSON.stringify(c.current.color7)},
})
`.trim()

export default function ColorCase() {
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
                                '### Color Cases'
                        ),
                        _('div', { ref }),
                ]
        )
}
