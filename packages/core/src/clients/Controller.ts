import { ctrl, merge } from '../index'
import Bounding from './Bounding'
import ControlLeft from './ControlLeft'
import ControlNav from './ControlNav'
import ControlRight from './ControlRight'
import Expanding from './Expanding'
import Wheelable from './Wheelable'

interface Props {
        left?: any
        plugin?: any
        layers?: any
        children?: any
}

const getDir = (x = 0, y = 0, w = 600, h = 600) => {
        // element center
        x += w / 2
        y += h / 2
        // normalize
        x /= window.innerWidth
        y /= window.innerHeight
        // vector from center
        x -= 0.5
        y -= 0.5
        if (x ** 2 <= y ** 2) {
                return [0, y > 0 ? 1 : -1]
        } else return [x > 0 ? 1 : -1, 0]
}

const ref = (el: HTMLElement) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const [dx, dy] = getDir(r.x, r.y, r.width, r.height)
        merge(el, {
                style: {
                        transform: `translate(${dx * 1000}px, ${dy * 1000}px)`,
                },
        })
}

export default function Controller(props: Props) {
        const { children, left, plugin, layers, ...other } = props
        const _ = ctrl.create
        return _(
                'div',
                {
                        className: '_ctrl-wrap w-full h-screen',
                        ...other, //
                },
                [
                        _(ControlNav, { ref, key: 'nav' }),
                        _(ControlLeft, { ref, key: 'left', layers }, left),
                        _(
                                Bounding,
                                { key: 'main' },
                                _(Wheelable, {}, _(Expanding, { children }))
                        ),
                        _(ControlRight, { ref, key: 'right' }, plugin),
                ]
        )
}
