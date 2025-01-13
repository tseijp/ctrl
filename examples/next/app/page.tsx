'use client'

import '@tsei/ctrl/src/style'
import ctrl from '@tsei/ctrl/src/index'

import { useEffect } from 'react'

// register(createElement as any, (el) => {
//         createPortal(el as any, document.body)
// })

export default () => {
        useEffect(() => {
                ctrl({ x: 1 }).sub()
        })

        const div = <div>HIHI</div>

        return div
}
