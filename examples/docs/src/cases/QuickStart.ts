import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({ hello: 'world' })

c.id = 'Quick Start'

const basicsCode = () =>
        /* TS */ `
import { useCtrl } from '@tsei/ctrl/react'

function MyComponent() {
        const { hello } = useCtrl({ hello: \`${c.current.hello}\` })
        return <div>{hello}</div>
}
`.trim()

const esmCode = () =>
        /* html */ `
<div id="root">world</div>
<script type="module">
        import { ctrl } from 'https://esm.sh/@tsei/ctrl@0.11.0/es2022'
        const c = ctrl({ hello: \`${c.current.hello}\` })
        const root = document.getElementById('root')

        c.sub(() => {
                root.innerText = c.current.hello
        })
</script>
`.trim()

export default function QuickStart() {
        const _ = ctrl.create

        const basicsRef = (el: HTMLElement) => {
                const update = codemirror(el, basicsCode)
                setTimeout(() => c.sub(update))
        }

        const esmRef = (el: HTMLElement) => {
                const update = codemirror(el, esmCode)
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
                                {
                                        key: '0', //
                                        className: 'font-bold',
                                },
                                '### Quick Start'
                        ),
                        _(
                                'h6',
                                {
                                        key: '1', //
                                        className: 'font-bold my-4',
                                },
                                '###### Basics'
                        ),
                        _(
                                'div', //
                                {
                                        key: '2', //
                                        ref: basicsRef,
                                }
                        ),
                        _(
                                'h6',
                                {
                                        key: '3', //
                                        className: 'font-bold my-4',
                                },
                                '###### ESM SUPPORT'
                        ),
                        _(
                                'div', //
                                {
                                        key: '4', //
                                        ref: esmRef,
                                }
                        ),
                ]
        )
}
