import { ctrl } from '@tsei/ctrl/src/index'
import { CSS } from '@tsei/ctrl/src/plugins/css/index'
import { codemirror } from '../utils'

ctrl.use(CSS)

const c = ctrl({
        cssPlugin0: { style: 'width:1280px; height:800px;' }, // or
        cssPlugin1: { style: { width: '1280px', height: '800px' } }, // or
        cssPlugin2: { value: { style: 'width:1280px; height:800px;' } }, // or
        cssPlugin3: { value: { style: { width: '1280px', height: '800px' } } },
})

const code = () =>
        /* TS */ `
import { ctrl } from '@tsei/ctrl/react'
import { css } from '@tsei/ctrl/css'

ctrl.use(css)

const c = ctrl({
      cssPlugin0: ${JSON.stringify(c.current.cssPlugin0)}, // or
      cssPlugin1: ${JSON.stringify(c.current.cssPlugin1)}, // or
      cssPlugin2: ${JSON.stringify(c.current.cssPlugin2)}, // or
      cssPlugin3: ${JSON.stringify(c.current.cssPlugin3)},
}
`.trim()

export default function PluginCase() {
        const _ = ctrl.create

        const ref = (el: HTMLElement) => {
                const update = codemirror(el, code)
                setTimeout(() => c.sub(update))
        }

        return _('div', { className: 'p-4 bg-white rounded' }, [
                _('h3', { className: 'font-bold mb-4' }, '### CSS Plugin'),
                _('div', { ref }),
        ])
}
