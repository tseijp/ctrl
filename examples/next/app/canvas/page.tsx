'use client'

import { Canvas } from '@react-three/fiber'
import { Controller, ctrl, useCtrl } from '@tsei/ctrl/src/react'
import { IgnoreScale } from '../utils'
import '@tsei/ctrl/src/style'

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
                text,
        } = useCtrl(c)

        console.log(text)

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
