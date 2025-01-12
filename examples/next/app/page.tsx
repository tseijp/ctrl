'use client'

import '@tsei/ctrl/src/style'
import ctrl, { register } from '@tsei/ctrl/src/index'

import { createElement, useEffect } from 'react'
import { createPortal } from 'react-dom'

register(createElement as any, (el) => {
        createPortal(el, document.body)
})

export default () => {
        useEffect(() => {
                console.log(ctrl({ x: 1 }).sub())
        })

        const div = <div>HIHI</div>

        return div
}
