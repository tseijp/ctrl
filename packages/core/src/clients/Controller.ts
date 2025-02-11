'use client'

import { ctrl, merge, PARENT_ID, register } from '../index'
import Bounding from './Bounding'
import Container from './Container'
import ControlLeft from './ControlLeft'
import ControlNav from './ControlNav'
import ControlRight from './ControlRight'
import Wheelable from './Wheelable'

interface Props {
        left?: any
        right?: any
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

let isInitialized = false

function initialize() {
        if (ctrl.parent) return
        if (isInitialized) return
        isInitialized = true
        register({
                parent: PARENT_ID,
        })
}

export default function Controller(props: Props) {
        initialize()
        const { children, left, right, ...other } = props
        const _ = ctrl.create
        return _('div', other, [
                _(ControlNav, { ref, key: 'nav' }),
                _(ControlLeft, { ref, key: 'left' }, left),
                _(Bounding, { key: 'main' }, _(Wheelable, { children })),
                // _(ControlRight, { ref, key: 'right', id: PARENT_ID }),
                _(
                        ControlRight,
                        { ref, key: 'right' },
                        _(Container, { isDraggable: false }, right)
                ),
        ])
}
