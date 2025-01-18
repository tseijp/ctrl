'use client'

import { Controller, useCtrl } from '@tsei/ctrl/src/react'
import '@tsei/ctrl/src/style'

// import ctrl, { register, Config } from '@tsei/ctrl'
// import { Controller } from '@tsei/ctrl/react'
// import '@tsei/ctrl/style'

export default () => {
        const { x } = useCtrl({ x: 1 })
        const left = <div className="text-white">{x}</div>

        return (
                <Controller left={left}>
                        <iframe
                                src="https://tsei.jp"
                                className="w-full h-full pointer-events-none"
                        />
                </Controller>
        )
}
