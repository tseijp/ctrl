'use client'

import ctrl, { register, Config } from '@tsei/ctrl/src/index'
import { Controller } from '@tsei/ctrl/src/react'
import '@tsei/ctrl/src/style'

// import ctrl, { register, Config } from '@tsei/ctrl'
// import { Controller } from '@tsei/ctrl/react'
// import '@tsei/ctrl/style'

import { createElement, useState, useSyncExternalStore } from 'react'

register({
        create: createElement,
        // render(el: HTMLElement, container: HTMLElement) {
        //         document.body.appendChild(el)
        // },
})

function useCtrl(config: Config) {
        const [a] = useState(() => ctrl(config))
        return useSyncExternalStore(a.sub, a.get, a.get)
}

export default () => {
        return (
                <Controller>
                        <div className="w-[1920px] h-[1080px] bg-white">
                                <iframe
                                        src="https://tsei.jp"
                                        className="w-full h-full pointer-events-none"
                                />
                        </div>
                </Controller>
        )
}
