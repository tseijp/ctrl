import { wheelEvent } from './../helpers/wheel'
import { ctrl, fullscreen, Props } from '../index'

const wheel = wheelEvent(() => {
        if (
                document.fullscreenElement &&
                document.fullscreenElement !== document.body
        )
                wheel.event?.stopImmediatePropagation()
})

const dbclick = (e: Event) => {
        const target = e.target as HTMLDivElement
        // @TODO FIX gesture
        if (
                target.clientWidth >= 1024 ||
                target.clientWidth >= window.innerWidth
        )
                fullscreen(target)
}

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
