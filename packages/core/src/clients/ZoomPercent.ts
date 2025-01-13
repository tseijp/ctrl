'use client'

let zoom = 0.5
import { create as _ } from '../index'

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
                listeners.forEach((f) => f())
        },
        sub,
}

// export default function useZoomStore() {
//         return useSyncExternalStore(
//                 sub,
//                 () => zoom,
//                 () => zoom
//         )
// }

export default function ZoomPercent() {
        const ref = (el: HTMLSpanElement) => {
                if (!el) return
                zoomStore.sub(() => {
                        el.innerText = `${(zoomStore.zoom * 100) << 0}%`
                })
        }
        return _('span', { ref }, `${(zoomStore.zoom * 100) << 0}%`)
}
