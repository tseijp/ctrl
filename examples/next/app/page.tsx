'use client'

import { Canvas } from '@react-three/fiber'
import { Controller, ctrl, useCtrl } from '@tsei/ctrl/src/react'
import '@tsei/ctrl/src/style'
import { IgnoreScale } from './utils'

const c = ctrl({
        position: [0, 0, 0] as const,
        scale: 1,
        hidden: false,
        text: 'string',
})

const Box = () => {
        const {
                position: [...position],
                scale,
                hidden,
        } = useCtrl(c)

        if (hidden) return null

        return (
                <mesh position={position} scale={scale}>
                        <boxGeometry />
                        <meshPhysicalMaterial />
                </mesh>
        )
}

export default () => {
        return (
                <Controller>
                        <Canvas style={{ width: 1280, height: 800 }}>
                                <Box />
                                <ambientLight />
                                <pointLight />
                                <IgnoreScale />
                        </Canvas>
                </Controller>
        )
}
