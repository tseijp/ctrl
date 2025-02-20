import { ctrl } from '../index'
import { wheelEvent } from '../helpers/wheel'

const ref = (el: Node | null) => {
        ctrl.pluginParent = el
}

const wheel = wheelEvent((wheel) => {
        const { event } = wheel
        const isZoom = (event as any).ctrlKey
        if (isZoom) return
        event.stopPropagation()
})

export default function ControlRight(props: any) {
        const { children } = props

        const _ = ctrl.create
        return _(
                'aside',
                {
                        key: 'right', //
                        ref: wheel.ref,
                        className: '_ctrl-aside _hidden-scrollbar right-0',
                },
                [
                        _(
                                'div',
                                {
                                        key: 'top',
                                        className: 'h-12 border-1 border-t border-[rgb(68,68,68)]',
                                },
                                _(
                                        'span',
                                        {
                                                key: 'span',
                                                className: 'mx-4 text-[13px] leading-[22px] font-bold',
                                        }
                                        // q ? 'Update' : 'New Creation'
                                )
                        ),
                        _(
                                'div',
                                {
                                        key: 'container',
                                        ref,
                                },
                                children
                        ),
                ]
        )
}
