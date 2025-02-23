import { wheelEvent } from './../helpers/wheel'
import { ctrl, Props } from '../index'

const dbclick = (e: Event) => {
        const target = e.target as HTMLElement
        if (document.fullscreenElement === target) {
                document.exitFullscreen()
        } else {
                target.requestFullscreen()
        }
}

const wheel = wheelEvent(() => {
        if (document.fullscreenElement) wheel.event?.stopPropagation()
})

const ref = (el: HTMLDivElement | null) => {
        if (!el) return wheel.onClean()
        el.addEventListener('dblclick', dbclick)
        wheel.onMount(el)
}

export default function Expanding(props: Props<'div'>) {
        const _ = ctrl.create
        return _('div', {
                ref, //
                className: '_ctrl-expanding',
                ...props,
        })
}
