import { useThree } from '@react-three/fiber'
import { useLayoutEffect, useState } from 'react'

/**
 * ref: https://github.com/pmndrs/react-three-fiber/issues/1394
 */
export function IgnoreScale() {
        const state = useThree()
        const [setSize] = useState(() => state.setSize)
        useLayoutEffect(() => {
                state.set({ setSize: () => null })
                return () => state.set({ setSize })
        }, [setSize])
        return null
}
