'use client'

import { ctrl, flush } from '../index'

let zoom = 1

const listeners = new Set<Function>()

const sub = (update = () => {}) => {
        listeners.add(update)

        return () => {
                listeners.delete(update)
        }
}

export const zoomStore = {
        get zoom() {
                return zoom
        },
        set zoom(value) {
                zoom = value
                flush(listeners)
        },
        sub,
}

export default function ZoomStore() {
        const percent = () => `${(zoomStore.zoom * 100) << 0}%`
        const ref = (el: HTMLSpanElement) => {
                if (!el) return
                zoomStore.sub(() => {
                        el.innerText = percent()
                })
        }

        const _ = ctrl.create
        return _('span', { ref }, percent())
}
