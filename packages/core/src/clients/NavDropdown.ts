import { ctrl, Vec2 } from '../index'
import Dropdown from './Dropdown'
import { transform } from './Wheeling'
import ZoomStore, { zoomStore } from './ZoomStore'

const items = [
        'Zoom in',
        'Zoom out',
        'Zoom to fit',
        'Zoom to 50%',
        'Zoom to 100%',
        'Zoom to 200%',
]

const xy = (x = 0) => Math.pow(2, x)
const yx = (y = 1) => Math.log2(y)

// @TODO FIX
// const coord = (next = 1, prev = 1, sign = 1) => {
//         return (offset: Vec2) => {
//                 // let dx = 1 - 1 / rate
//                 // dx *= rect.width
//                 let dx = window.innerWidth
//                 let dy = window.innerHeight
//                 dx = dx * next - dx * prev
//                 dy = dy * next - dy * prev
//                 dx *= 0.5 * sign
//                 dy *= 0.5 * sign
//                 dx /= next
//                 dy /= next
//                 offset[0] += dx
//                 offset[1] += dy
//         }
// }

const reset = (offset: Vec2) => {
        offset[0] = -240
        offset[1] = -48
        // padding
        offset[0] -= 16
        offset[1] -= 16
}

const zoomIn = () => {
        const prev = zoomStore.zoom
        const a = yx(prev)
        const b = Math.ceil(a)
        const next = xy(b > a ? b : b + 1)
        zoomStore.zoom = next
        transform()
}

const zoomOut = () => {
        const prev = zoomStore.zoom
        const a = yx(prev)
        const b = Math.floor(a)
        const next = xy(b < a ? b : b - 1)
        zoomStore.zoom = next
        transform()
}

const getMainRect = () => {
        const main = document.querySelector('._ctrl-main')
        const child = main?.childNodes[0] as HTMLDivElement
        return child.getBoundingClientRect()
}

const zoomTo = (to: number) => {
        const fit = to === -1
        if (fit) {
                const padding = 32
                const rect = getMainRect()
                const width = window.innerWidth - 240 * 2
                const scale = (width * zoomStore.zoom - padding) / rect.width
                zoomStore.zoom = scale
                transform(reset)
        } else zoomStore.zoom = to
        transform()
}

const onClick = (item: string) => {
        if (item === items[0]) return zoomIn()
        if (item === items[1]) return zoomOut()
        if (item === items[2]) return zoomTo(-1)
        if (item === items[3]) return zoomTo(0.5)
        if (item === items[4]) return zoomTo(1)
        if (item === items[5]) return zoomTo(2)
}

export default function NavDropdown() {
        const _ = ctrl.create
        return _(
                Dropdown,
                {
                        key: 'right', //
                        left: -216,
                        items,
                        onClick,
                        className: '_ctrl-button gap-1 px-3.5',
                },
                [
                        _(
                                'span',
                                {
                                        key: 'zoom', // @TODO
                                        className: 'text-[11px]',
                                },
                                _(ZoomStore)
                        ),
                        _('img', {
                                src: 'https://r.tsei.jp/ctrl/arrow.svg',
                                alt: '🔽',
                                key: 'arrow',
                                width: 8,
                                height: 7,
                        }),
                ]
        )
}
