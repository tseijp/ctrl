import { ctrl } from '../index'
import { dragEvent } from '../helpers/drag'
import { merge, subV, Vec2 } from '../helpers/utils'
import { wheelEvent } from '../helpers/wheel'
import { zoomStore } from './ZoomStore'
import { isGrab } from './HandButton'

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

const zoomCoord = (offset: Vec2) => {
        let [x, y] = offset
        const { clientX, clientY } = wheel.event as any
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
                zoom(zoomCoord)
        } else {
                zoomStore.zoom = zoomStore.zoom // flush update
                zoom()
        }
})

const drag = dragEvent(() => {
        const { event, delta, memo } = drag

        if (!isGrab()) {
                if (!memo.wrap)
                        memo.wrap = document.querySelector('._ctrl-wrap')
                const isWrap = event?.target === memo.wrap
                if (!isWrap) {
                        document.body.style.cursor = ''
                        return
                }
        }

        if (event) event.preventDefault()

        document.body.style.cursor = 'grab'

        if (drag.isDragging) document.body.style.cursor = 'grabbing'

        // reset cursor if not grab mode
        if (drag.isDragEnd) {
                if (!isGrab())
                        setTimeout(() => {
                                document.body.style.cursor = ''
                        }, 200)
        }

        if (drag.isDragging) {
                zoom((offset) => {
                        offset[0] -= delta[0]
                        offset[1] -= delta[1]
                })
        }
})

const ref = (el: HTMLDivElement) => {
        if (!el) {
                wheel.onClean()
                drag.onClean()
                return
        }

        // @ts-ignore
        wheel.memo.el = el
        wheel.offset[0] = -240 // var(--sidebar-width) in index.css
        wheel.offset[1] = -48 // var(--header-height) in index.css
        drag.onMount(el)
        wheel.onMount(window as any)
}

export default function Wheeling(props: Props) {
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
