import { ctrl, type Props } from '@tsei/ctrl/src/index'

const c = ctrl({
        INSTALL: 'npm i @tsei/ctrl', // @TODO
})

const code = () =>
        /* TS */ `
npm i @tsei/ctrl
`.trim()

export default function Installation(props: Props<'pre'>) {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = () => (el.innerText = code())
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Installation'),
                _('code', { ref, className: 'language-javascript' }, code()),
        ])
}
