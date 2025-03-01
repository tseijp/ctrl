import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({ hello: 'world' })

c.id = 'Basic Example'

const basicsCode = () =>
        /* TS */ `
import { useCtrl } from '@tsei/ctrl/react'

function App() {
        const { hello } = useCtrl({ hello: '${c.current.hello}' })
        return <div>{hello}</div>
}
`.trim()

const solidCode = () =>
        /* html */ `
import { useCtrl } from '@tsei/ctrl/solid'

export default function App() {
        const c = useCtrl({ hello: '${c.current.hello}' })
        return <div>{c.hello}</div>
}
`.trim()

const vueCode = () =>
        /* html */ `
<script setup>
import '@tsei/ctrl/style'
import { useCtrl } from '@tsei/ctrl/vue3'
const c = useCtrl({ hello: '${c.current.hello}' })
</script>

<template>
        {{ c.hello }}
</template>
`.trim()

const esmCode = () =>
        /* html */ `
<div id="root">world</div>
<script type="module">
        import { ctrl } from 'https://esm.sh/@tsei/ctrl@latest/es2022/index.mjs'
        const c = ctrl({ hello: '${c.current.hello}' })
        c.sub(() => {
                document.getElementById('root').innerText = c.current.hello
        })
</script>
`.trim()

export default function Example() {
        const _ = ctrl.create

        const basicsRef = (el: HTMLElement) => {
                const update = codemirror(el, basicsCode)
                setTimeout(() => c.sub(update))
        }

        const solidRef = (el: HTMLElement) => {
                const update = codemirror(el, solidCode)
                setTimeout(() => c.sub(update))
        }

        const vueRef = (el: HTMLElement) => {
                const update = codemirror(el, vueCode)
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
                                '### Basic Example'
                        ),
                        _(
                                'h6',
                                {
                                        key: '1', //
                                        className: 'font-bold my-4',
                                },
                                '###### React Support'
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
                                '###### Solid Support'
                        ),
                        _(
                                'div', //
                                {
                                        key: '4', //
                                        ref: solidRef,
                                }
                        ),
                        _(
                                'h6',
                                {
                                        key: '5', //
                                        className: 'font-bold my-4',
                                },
                                '###### Vue Support'
                        ),
                        _(
                                'div', //
                                {
                                        key: '6', //
                                        ref: vueRef,
                                }
                        ),
                        _(
                                'h6',
                                {
                                        key: '7', //
                                        className: 'font-bold my-4',
                                },
                                '###### ESM Support'
                        ),
                        _(
                                'div', //
                                {
                                        key: '8', //
                                        ref: esmRef,
                                }
                        ),
                ]
        )
}
