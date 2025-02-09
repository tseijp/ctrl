import { ctrl, type Props } from '@tsei/ctrl/src/index'

const basicsCode = /* TS */ `
import { useCtrl } from '@tsei/ctrl/react'

function MyComponent() {
        const { hello } = useCtrl({ hello: 'world' })
        return <div>{hello}</div>
}
`.trim()

const esmCode = /* html */ `
<div id="root" />
<script type="module">
        import { ctrl } from 'https://esm.sh/@tsei/ctrl@0.11.0/es2022'
        const c = ctrl({ hello: 'world' })
        const root = document.getElementById('root')

        c.sub(() => {
                root.innerText = c.current.hello
        })
</script>
`.trim()

const c = ctrl({ basicsCode, esmCode })

export default function QuickStart(props: Props<'pre'>) {
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
                _('h3', { className: 'font-bold mb-4' }, '### Quick Start'),
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
