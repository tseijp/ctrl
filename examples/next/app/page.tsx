'use client'

import { Canvas } from '@react-three/fiber'
import { Controller, ctrl, useCtrl } from '@tsei/ctrl/src/react'
import '@tsei/ctrl/src/style'

// import ctrl, { register, Config } from '@tsei/ctrl'
// import { Controller } from '@tsei/ctrl/react'
// import '@tsei/ctrl/style'

const c = ctrl({ position: [0, 0, 0], scale: 1, hidden: false, text: 'string' })

const Box = () => {
        const { position, scale, hidden, text } = useCtrl(c)

        if (hidden) return null

        return (
                <mesh position={[...position]} scale={scale}>
                        <boxGeometry />
                        <meshBasicMaterial />
                </mesh>
        )
}

export default () => {
        return (
                <Controller>
                        <Canvas>
                                <Box />
                        </Canvas>
                </Controller>
        )
}
