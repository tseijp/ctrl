import { ctrl, Vec2 } from '../index'
import Dropdown from './Dropdown'
import { zoom } from './Wheelable'
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
        offset[1] = -40
}

const zoomIn = () => {
        const prev = zoomStore.zoom
        const a = yx(prev)
        const b = Math.ceil(a)
        const next = xy(b > a ? b : b + 1)
        zoomStore.zoom = next
        zoom()
}

const zoomOut = () => {
        const prev = zoomStore.zoom
        const a = yx(prev)
        const b = Math.floor(a)
        const next = xy(b < a ? b : b - 1)
        zoomStore.zoom = next
        zoom()
}

const getMainRect = () => {
        const main = document.querySelector('._ctrl-main')
        const child = main?.childNodes[0] as HTMLDivElement
        return child.getBoundingClientRect()
}

const zoomTo = (to: 'fit' | number) => {
        const fit = to === 'fit'
        if (fit) {
                const rect = getMainRect()
                const width = window.innerWidth - 240 * 2
                const scale = (width * zoomStore.zoom) / rect.width
                zoomStore.zoom = scale
                zoom(reset)
        } else zoomStore.zoom = to
        zoom()
}

const onClick = (item: string) => {
        if (item === items[0]) return zoomIn()
        if (item === items[1]) return zoomOut()
        if (item === items[2]) return zoomTo('fit')
        if (item === items[3]) return zoomTo(0.5)
        if (item === items[4]) return zoomTo(1)
        if (item === items[5]) return zoomTo(2)
}

export default function ControlNav() {
        const _ = ctrl.create
        return _(
                'nav',
                {
                        key: 'nav', //
                        className: '_ctrl-nav',
                },
                [
                        _(
                                'div',
                                {
                                        key: 'left', //
                                        className: 'flex',
                                },
                                [
                                        _(
                                                'button',
                                                {
                                                        key: 'neko',
                                                        className: '_ctrl-button gap-0.5 w-[50px] bg-[rgb(11,140,233)]',
                                                },
                                                [
                                                        _('img', {
                                                                src: 'https://r.tsei.jp/ctrl/ungra.svg',
                                                                alt: '😺',
                                                                key: 'neko',
                                                                width: 24,
                                                                height: 19,
                                                        }),
                                                        _('img', {
                                                                src: 'https://r.tsei.jp/ctrl/arrow.svg',
                                                                alt: '🔽',
                                                                key: 'arrow',
                                                                width: 8,
                                                                height: 7,
                                                        }),
                                                ]
                                        ),
                                        _(
                                                'button',
                                                {
                                                        key: 'move',
                                                        className: '_ctrl-button w-10',
                                                },
                                                _('img', {
                                                        src: 'https://r.tsei.jp/ctrl/move.svg',
                                                        alt: '👆',
                                                        key: 'move',
                                                        width: 18,
                                                        height: 18,
                                                })
                                        ),
                                        _(
                                                'button',
                                                {
                                                        key: 'hand',
                                                        className: '_ctrl-button w-10',
                                                },
                                                _('img', {
                                                        src: 'https://r.tsei.jp/ctrl/hand.svg',
                                                        alt: '🖐️',
                                                        key: 'hand',
                                                        width: 20,
                                                        height: 20,
                                                })
                                        ),
                                        _(
                                                'button',
                                                {
                                                        key: 'comment',
                                                        className: '_ctrl-button w-10',
                                                },
                                                _('img', {
                                                        src: 'https://r.tsei.jp/ctrl/comment.svg',
                                                        alt: '💬',
                                                        key: 'comment',
                                                        width: 20,
                                                        height: 20,
                                                })
                                        ),
                                ]
                        ),
                        _(
                                Dropdown,
                                {
                                        key: 'right', //
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
                        ),
                ]
        )
}
