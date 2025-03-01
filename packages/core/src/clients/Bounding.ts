import { ctrl } from '../index'
import { zoomStore } from './ZoomStore'
import { merge } from '../helpers/utils'

const boundingStyle = {
        zIndex: '100',
        top: '0px',
        position: 'fixed',
        border: '1px solid #0B8CE9',
        color: '#0B8CE9',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
}

interface Rect {
        top: number
        left: number
        width: number
        height: number
}

const min = (a = 0, b = 0, A = 0, B = 0) => {
        const aA = Math.abs(a - A)
        const aB = Math.abs(a - B)
        const bA = Math.abs(b - A)
        const bB = Math.abs(b - B)
        const len = Math.min(aA, aB, bA, bB)
        if (aA === len) return [Math.min(a, A), len]
        if (aB === len) return [Math.min(a, B), len]
        if (bA === len) return [Math.min(b, A), len]
        return [Math.min(b, B), len]
}

const len = (rect: Rect, rect2: Rect) => {
        const [left, width] = min(
                rect.left,
                rect.left + rect.width,
                rect2.left,
                rect2.left + rect2.width
        )
        const [top, height] = min(
                rect.top,
                rect.top + rect.height,
                rect2.top,
                rect2.top + rect2.height
        )

        return { top, left, width, height }
}

const draw = (el: HTMLElement | null, rect: Rect, zoom = zoomStore.zoom) => {
        if (!el) return

        merge(el.style, {
                opacity: '1',
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
        })

        const w = Math.round(rect.width / zoom)
        const h = Math.round(rect.height / zoom)

        el.innerHTML = `${w}x${h}`
}

const line = (el: HTMLDivElement | null, rect: Rect) => {
        if (!el) return
        draw(el, rect)
}

const clear = (el: HTMLElement | null) => {
        if (!el) return

        merge(el.style, { opacity: '0' })
}

export const createBounding = <El extends HTMLElement>(selectors?: string) => {
        let isActive = false
        let hoverEl: HTMLDivElement | null = null
        let clickEl: HTMLDivElement | null = null
        let lineEl: HTMLDivElement | null = null
        let hoverTarget: HTMLElement | null = null
        let clickTarget: HTMLElement | null = null
        let initClicked: HTMLElement | null = null
        let isParent = (_: Rect) => false

        const hover = (e: Event) => {
                if (!isActive) return // ignore

                // target
                hoverTarget = e.target as HTMLElement
                if (!hoverTarget || !hoverEl) return

                if (hoverTarget === initClicked) clear(hoverEl)

                // draw
                const rect = hoverTarget.getBoundingClientRect()
                if (isParent(rect)) return clear(hoverEl)
                draw(hoverEl, rect)

                if (!clickTarget) return
                const rect2 = clickTarget.getBoundingClientRect()
                line(lineEl, len(rect, rect2))
        }

        const click = (e: Event) => {
                // reset hover
                hoverTarget = null
                clear(hoverEl)

                // target
                if (clickTarget && initClicked === e.target && isActive)
                        clickTarget = clickTarget.parentElement
                else initClicked = clickTarget = e.target as HTMLElement

                if (!clickTarget) return

                // draw
                const rect = clickTarget.getBoundingClientRect()
                if (isParent(rect)) return clear(clickEl)
                draw(clickEl, rect)
        }

        const reset = () => {
                const rect = hoverTarget?.getBoundingClientRect()
                if (rect) {
                        if (isParent(rect)) clear(hoverEl)
                        else draw(hoverEl, rect)
                }

                const rect2 = clickTarget?.getBoundingClientRect()

                if (rect2) {
                        if (!isParent(rect2)) draw(clickEl, rect2)
                }

                if (rect && rect2) line(lineEl, len(rect, rect2))
        }

        const keydown = (e: { key: string }) => {
                if (e.key === 'Alt') isActive = true
        }

        const keyup = () => {
                isActive = false
                clear(hoverEl)
                clear(lineEl)
                hoverTarget = null
        }

        const ref = (el: El | null) => {
                if (!el) {
                        window.removeEventListener('keydown', keydown)
                        window.removeEventListener('keyup', keyup)
                        return
                }

                // setup bounding div element
                hoverEl = document.createElement('div')
                clickEl = document.createElement('div')
                lineEl = document.createElement('div')
                el.addEventListener('mousemove', hover)
                el.addEventListener('mousedown', click)
                window.addEventListener('scroll', reset)
                window.addEventListener('wheel', reset)
                window.addEventListener('keydown', keydown)
                window.addEventListener('keyup', keyup)
                merge(hoverEl.style, boundingStyle)
                merge(clickEl.style, boundingStyle)
                merge(lineEl.style, boundingStyle)
                el.appendChild(hoverEl)
                el.appendChild(clickEl)
                el.appendChild(lineEl)
                const pr = el.parentElement?.getBoundingClientRect()!

                isParent = (rect) =>
                        pr?.width <= rect.width && pr.height <= rect.height
        }

        if (selectors && typeof window !== 'undefined')
                ref(document.querySelector(selectors))

        return ref
}

export default function Bounding<T>(props: T) {
        const ref = createBounding()
        const _ = ctrl.create
        return _('div', {
                ref, //
                ...props,
        })
}
