import { ctrl } from '@tsei/ctrl/src/react'
import { codemirror, scrollTo } from '../utils'

const c = ctrl({ a: 0, b: 1, c: 2 })

c.id = 'Render Controller'

const basicsCode = () =>
        /* TS */ `
import '@tsei/ctrl/style'
import { Controller, useCtrl } from '@tsei/ctrl/react'

function App() {
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

const solidCode = () =>
        /* TSX */ `
import '@tsei/ctrl/style'
import { Controller, useCtrl } from '@tsei/ctrl/react'

function App() {
        const c = useCtrl({ a: ${c.current.a}, b: ${c.current.b}, c: ${c.current.c} })
        return (
                <>
                        <Controller />
                        <ul>
                                <li>{c.a}</li>
                                <li>{c.b}</li>
                                <li>{c.c}</li>
                        </ul>
                </>
        )
}
`.trim()

const vueCode = () =>
        /* html */ `
<script setup>
import '@tsei/ctrl/style'
import { Controller, useCtrl } from '@tsei/ctrl/src/vue3'
const c = ctrl({ a: ${c.current.a}, b: ${c.current.b}, c: ${c.current.c} })
</script>

<template>
        <Controller />
        <ul>
                <li>{c.a}</li>
                <li>{c.b}</li>
                <li>{c.c}</li>
        </ul>
</template>
`.trim()

const esmCode = () =>
        /* html */ `
<link rel="stylesheet" href="https://esm.sh/@tsei/ctrl@latest/dist/index.css" />
<script type="module">
        import {
                Controller,
                ctrl,
        } from 'https://esm.sh/@tsei/ctrl@latest/es2022/index.mjs'
        const c = ctrl({ a: ${c.current.a}, b: ${c.current.b}, c: ${c.current.c} })
        const _ = ctrl.create

        ctrl.append(
                _(
                        Controller,
                        {},
                        _('ul', {}, [
                                _('li', { id: 'a' }, '0'),
                                _('li', { id: 'b' }, '1'),
                                _('li', { id: 'c' }, '2'),
                        ])
                ),
                document.body
        )

        c.sub((key) => {
                document.getElementById(key).innerText = c.current[key]
        })
</script>
`.trim()

export default function Controll() {
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
                                '### Render Controller'
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
