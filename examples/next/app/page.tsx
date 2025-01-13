'use client'

import { useCtrl, Controller } from '@tsei/ctrl/src/react'
import '@tsei/ctrl/src/style'

// import ctrl, { register, Config } from '@tsei/ctrl'
// import { Controller } from '@tsei/ctrl/react'
// import '@tsei/ctrl/style'

export default () => {
        const { x } = useCtrl({ x: 1 })
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
