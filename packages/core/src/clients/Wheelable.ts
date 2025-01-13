'use client'

import { create as e } from '../index'
import { subV } from '../helpers/utils'
import { wheelEvent } from '../helpers/wheel'

// import { zoomStore } from '@/app/_hooks/useZoomStore'
// import useWheelEvent from '@/app/_hooks/useWheelEvent'
// import { subV } from '@/app/_hooks/utils'
// import React, { useRef, useEffect } from 'react'

interface Props {
        children: any
}

export default function Wheelable(props: Props) {
        const { children } = props
        const cache = { clientX: 0, clientY: 0 }
        const zoomStore = { zoom: 1 } // @TODO FIX

        const wheel = wheelEvent((wheel) => {
                const { active, offset, delta, event } = wheel
                const isZoom = (event as any).ctrlKey
                if (isZoom && active) subV(offset, delta, offset) // revert

                let [x, y] = offset
                // reverse
                x *= -1
                y *= -1

                event.preventDefault()

                if (isZoom) {
                        const { clientX, clientY } = cache
                        const dz = (-delta[1] / 750) * (zoomStore.zoom * 10)
                        const dx = (-dz * (clientX - 240 - x)) / zoomStore.zoom
                        const dy = (-dz * (clientY - 48 - y)) / zoomStore.zoom

                        // coord
                        x += dx
                        y += dy

                        offset[0] = -x
                        offset[1] = -y

                        zoomStore.zoom = Math.max(0.02, zoomStore.zoom + dz)

                        Object.assign(el.style, {
                                x,
                                y,
                                scale: zoomStore.zoom,
                                duration: 0.1,
                        })

                        return
                }

                // @TODO FIX
                zoomStore.zoom = zoomStore.zoom
                const transform = `translate(${x}px, ${y}px)`
                Object.assign(el.style, { transform })
        })

        let el: HTMLDivElement

        const ref = (_el: HTMLDivElement) => {
                if (!_el) return
                el = _el
                const handleMove = (e: {
                        clientX: number
                        clientY: number
                }) => {
                        const { clientX, clientY } = e
                        Object.assign(cache, { clientX, clientY })
                }

                window.addEventListener('mousemove', handleMove)
                wheel.onMount(el.parentElement as any)

                // return () => {
                //         window.removeEventListener('mousemove', handleMove)
                //         wheel.onClean()
                // }
        }

        return e('div', {
                ref,
                className: 'scale-[0.5] origin-top-left w-full h-full',
                children,
        })
}
