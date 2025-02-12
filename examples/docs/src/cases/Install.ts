import { ctrl } from '@tsei/ctrl/src/index'
import { codemirror } from '../utils'

const c = ctrl({
        INSTALL: 'npm i @tsei/ctrl',
})

c.title = 'Installation'

export default function Installation() {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = codemirror(el, () => c.current.INSTALL)
                setTimeout(() => c.sub(update))
        }

        return _('div', { className: 'p-4 bg-white rounded' }, [
                _('h3', { className: 'font-bold mb-4' }, '### Installation'),
                _('div', { ref }),
        ])
}
