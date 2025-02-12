import { ctrl } from '@tsei/ctrl/src/index'
import { codemirror } from '../utils'

const c = ctrl({
        vector0: [0, 0, 0], // or
        vector1: { x: 1, y: 1, z: 1 }, // or
        vector2: { value: [0, 0, 0] }, // or
        vector3: { value: { x: 1, y: 1, z: 1 } },
})

c.title = 'Vector'

const code = () =>
        /* TS */ `
// Vector
const c = ctrl({
        vector0: ${JSON.stringify(c.current.vector0)}, // or
        vector1: ${JSON.stringify(c.current.vector1)}, // or
        vector2: ${JSON.stringify(c.current.vector2)}, // or
        vector3: ${JSON.stringify(c.current.vector3)},
})
`.trim()

export default function VectorCase() {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = codemirror(el, code)
                setTimeout(() => c.sub(update))
        }

        return _('div', { className: 'p-4 bg-white rounded' }, [
                _('h3', { className: 'font-bold mb-4' }, '### Vector Cases'),
                _('div', { ref }),
        ])
}
