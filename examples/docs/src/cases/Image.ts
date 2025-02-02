import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        image0: 'https://r.tsei.jp/texture/Brick.jpg', // or
        image1: { value: 'https://r.tsei.jp/texture/Rust.jpg' },
})

const code = () =>
        /* TS */ `
// Image
const c = ctrl({
        image0: ${JSON.stringify(c.current.image0)}, // @TODO SUPPORT
        image1: ${JSON.stringify(c.current.image1)}, // @TODO SUPPORT
})
`.trim()

export default function ImageCase(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Image Cases'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
