import { ctrl } from '../index'
import { is, merge, subV } from '../helpers/utils'
import { wheelEvent } from '../helpers/wheel'
import { zoomStore } from './ZoomStore'
import { Vec2 } from '../../dist/index'

interface Props {
        children: any
}

// for ControlNav zoom button
export const zoom = (coord?: (offset: Vec2) => void) => {
        if (coord) coord(wheel.offset)

        // @ts-ignore
        const el = wheel.memo.el
        let [x, y] = wheel.offset
        // reverse
        x *= -1
        y *= -1

        // apply style
        const transform = `translate(${x}px, ${y}px) scale(${zoomStore.zoom})`
        merge(el.style, { transform })
}

const cache = { clientX: 0, clientY: 0 }

const coord = (offset: Vec2) => {
        let [x, y] = offset
        const { clientX, clientY } = cache
        const dz = (wheel.delta[1] * zoomStore.zoom) / 75
        const dx = (dz * (clientX + x)) / zoomStore.zoom
        const dy = (dz * (clientY + y)) / zoomStore.zoom

        // coord
        x -= dx
        y -= dy

        offset[0] = x
        offset[1] = y

        zoomStore.zoom = Math.max(0.01, zoomStore.zoom - dz)
}

const wheel = wheelEvent(() => {
        const { active, offset, delta, event } = wheel
        const isZoom = (event as any).ctrlKey
        if (isZoom && active) subV(offset, delta, offset) // revert

        event.preventDefault()

        if (isZoom) {
                zoom(coord)
        } else {
                zoomStore.zoom = zoomStore.zoom // flush update
                zoom()
        }
})

const move = (e: { clientX: number; clientY: number }) => {
        const { clientX, clientY } = e
        merge(cache, { clientX, clientY })
}

const ref = (el: HTMLDivElement) => {
        if (!el) {
                window.removeEventListener('mousemove', move)
                wheel.onClean()
                return
        }

        // @ts-ignore
        wheel.memo.el = el
        wheel.offset[0] = -240 // var(--sidebar-width) in index.css
        wheel.offset[1] = -48 // var(--header-height) in index.css
        window.addEventListener('mousemove', move)
        wheel.onMount(window as any)
}

export default function Wheelable(props: Props) {
        const { children } = props
        const _ = ctrl.create
        return _(
                'div',
                {
                        ref,
                        className: 'relative origin-top-left _ctrl-main',
                },
                children
        )
}
