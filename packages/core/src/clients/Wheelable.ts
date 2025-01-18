'use client'

import ctrl from '../index'
import { merge, subV } from '../helpers/utils'
import { wheelEvent } from '../helpers/wheel'
import { zoomStore } from './ZoomStore'

interface Props {
        children: any
}

export default function Wheelable(props: Props) {
        const { children } = props
        const cache = { clientX: 0, clientY: 0 }

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

                        const transform = `translate(${x}px, ${y}px) scale(${zoomStore.zoom})`
                        merge(el.style, { transform })
                } else {
                        zoomStore.zoom = zoomStore.zoom // flush update
                        const transform = `translate(${x}px, ${y}px) scale(${zoomStore.zoom})`
                        merge(el.style, { transform })
                }
        })

        let el: HTMLDivElement

        const move = (e: { clientX: number; clientY: number }) => {
                const { clientX, clientY } = e
                merge(cache, { clientX, clientY })
        }

        const ref = (_el: HTMLDivElement) => {
                if (!_el) {
                        window.removeEventListener('mousemove', move)
                        wheel.onClean()
                        return
                }

                el = _el
                const rect = el.getBoundingClientRect()
                wheel.offset[0] = -rect.left
                wheel.offset[1] = -rect.top
                window.addEventListener('mousemove', move)
                setTimeout(() => {
                        wheel.onMount(el.parentElement as any)
                }, 100)
        }

        const _ = ctrl.create
        return _(
                'div',
                {
                        ref,
                        className: 'origin-top-left _ctrl-main',
                },
                children
        )
}
