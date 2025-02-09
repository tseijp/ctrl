import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        image0: { src: 'https://r.tsei.jp/block.png' }, // or
        image1: document.querySelector('img'), // or
        image2: { value: { src: 'https://r.tsei.jp/block.png' } }, // or
        image3: { value: document.querySelector('img') },
})

const code = () =>
        /* TS */ `
// Image
const c = ctrl({
        image0: ${JSON.stringify(c.current.image0)}, // or
        image1: ${JSON.stringify(c.current.image1)}, // or
        image2: ${JSON.stringify(c.current.image2)}, // or
        image3: ${JSON.stringify(c.current.image3)},
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
