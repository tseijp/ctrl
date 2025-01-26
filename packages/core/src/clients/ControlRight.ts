'use client'

import { ctrl, PARENT_ID, wheelEvent } from '../index'

export default function ControlRight(props: any) {
        const { children } = props
        const _ = ctrl.create
        const { ref } = wheelEvent((wheel) => {
                const { event } = wheel
                const isZoom = (event as any).ctrlKey
                if (isZoom) return
                event.stopPropagation()
        })

        return _(
                'aside',
                {
                        key: 'right', //
                        ref,
                        className: '_ctrl-aside right-0',
                },
                [
                        _(
                                'div',
                                {
                                        key: 'top',
                                        className: 'h-10 border-1 border-y border-[rgb(68,68,68)]',
                                },
                                _(
                                        'span',
                                        {
                                                key: 'span',
                                                className: 'mx-4 leading-10 font-bold',
                                        }
                                        // q ? 'Update' : 'New Creation'
                                )
                        ),
                        _(
                                'div',
                                {
                                        id: PARENT_ID,
                                        key: 'container',
                                },
                                children
                        ),
                ]
        )
}
