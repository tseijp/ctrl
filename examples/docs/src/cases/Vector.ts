import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        vector0: [0, 0, 0], // or
        vector1: { x: 1, y: 1, z: 1 }, // or
        vector2: { value: [0, 0, 0] }, // or
        vector3: { value: { x: 1, y: 1, z: 1 } },
})

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

export default function VectorCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Vector Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
