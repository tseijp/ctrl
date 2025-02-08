'use client'

import { Canvas } from '@react-three/fiber'
import { Controller, ctrl, useCtrl } from '@tsei/ctrl/react'
import '@tsei/ctrl/src/style'

const c = ctrl({ position: [0, 0, 0], scale: 1, hidden: false, text: 'string' })

const Box = () => {
        const { position, scale, hidden } = useCtrl(c)

        if (hidden) return null

        return (
                <mesh position={[...position]} scale={scale}>
                        <boxGeometry />
                        <meshPhysicalMaterial />
                </mesh>
        )
}

export default () => {
        return (
                <Controller>
                        <Canvas>
                                <ambientLight />
                                <pointLight />
                                <Box />
                        </Canvas>
                </Controller>
        )
}
