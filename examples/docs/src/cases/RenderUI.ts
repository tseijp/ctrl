import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({ a: 0, b: 0, c: 0 })

c.id = 'Render UI'

const basicsCode = () =>
        /* TS */ `
import { Controller, useCtrl } from '@tsei/ctrl/react'
import '@tsei/ctrl/style'

function MyComponent() {
        const { a, b, c } = useCtrl({ a: ${c.current.a}, b: ${c.current.b}, c: ${c.current.c} })
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

const esmCode = () =>
        /* html */ `
<link rel="stylesheet" href="https://esm.sh/@tsei/ctrl@0.11.0/dist/index.css" />
<script type="module">
        import {
                Controller,
                ctrl,
        } from 'https://esm.sh/@tsei/ctrl@0.11.0/es2022'
        const c = ctrl({ a: ${c.current.a}, b: ${c.current.b}, c: ${c.current.c} })
        const _ = ctrl.create

        ctrl.append(
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

export default function RenderUI() {
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
                                '### Render UI'
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
