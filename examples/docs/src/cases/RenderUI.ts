import { ctrl, type Props } from '@tsei/ctrl/src/index'

const basicsCode = /* TS */ `
import { Controller, useCtrl } from '@tsei/ctrl/react'
import '@tsei/ctrl/style'

function MyComponent() {
        const { a, b, c } = useCtrl({ a: 0, b: 0, c: 0 })
        return (
                <Controller>
                        <ul>
                                <li>{a}</li>
                                <li>{b}</li>
                                <li>{c}</li>
                        </ul>
                </Controller>
        )
}
`.trim()

const esmCode = /* html */ `
<link rel="stylesheet" href="https://esm.sh/@tsei/ctrl@0.11.0/dist/index.css" />
<script type="module">
        import {
                Controller,
                ctrl,
        } from 'https://esm.sh/@tsei/ctrl@0.11.0/es2022'
        const c = ctrl({ a: 0, b: 0, c: 0 })
        const _ = ctrl.create

        ctrl.render(
                _(
                        Controller,
                        {},
                        _('ul', {}, [
                                _('li', { id: 'a' }, '0'),
                                _('li', { id: 'b' }, '0'),
                                _('li', { id: 'c' }, '0'),
                        ])
                ),
                document.body
        )

        c.sub((key) => {
                document.getElementById(key).innerText = c.current[key]
        })
</script>
`.trim()

const c = ctrl({ basicsCode, esmCode })

export default function RenderUI(props: Props<'pre'>) {
        const _ = ctrl.create

        const basicsRef = (el: HTMLElement) => {
                const update = () => (el.innerText = c.current.basicsCode)
                setTimeout(() => c.sub(update))
        }

        const esmRef = (el: HTMLElement) => {
                const update = () => (el.innerText = c.current.esmCode)
                setTimeout(() => c.sub(update))
        }

        return _('pre', props, [
                _('h3', { className: 'font-bold mb-4' }, '### Render UI'),
                _('h6', { className: 'font-bold' }, '###### Basics'),
                _(
                        'code',
                        { ref: basicsRef, className: 'language-javascript' },
                        basicsCode
                ),
                _('h6', { className: 'font-bold my-4' }, '###### ESM SUPPORT'),
                _(
                        'code',
                        { ref: esmRef, className: 'language-javascript' },
                        esmCode
                ),
        ])
}
