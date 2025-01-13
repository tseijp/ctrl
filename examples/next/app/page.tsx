'use client'

import '@tsei/ctrl/src/style'
import ctrl, { register, Config } from '@tsei/ctrl/src/index'
import { CtrlUI } from '@tsei/ctrl/src/react'

import { createElement, useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Controller from '@tsei/ctrl/src/clients/Controller'

register({
        create: createElement,
        // render(el: HTMLElement, container: HTMLElement) {
        //         document.body.appendChild(el)
        // },
})

// register(createElement as any, (el, container) => {
//         console.log(el, container)
//         createPortal(el as any, container)
// })

function useCtrl(config: Config) {
        const [a] = useState(() => ctrl(config))
        return useSyncExternalStore(a.sub, a.get, a.get)
}

export default () => {
        // const { x } = useCtrl({ x: 1 })

        // const div = <div>{x}</div>

        return (<Controller />) as any
}
