'use client'

import { ctrl, dragEvent } from '../index'

export default function LeftLayers(props: any) {
        const { children } = props
        const _ = ctrl.create
        const drag = dragEvent(() => {
                const top = drag.target?.parentElement!
                const [, my] = drag.offset
                top.style.height = `${320 - my}px`
        })

        return _(
                'div',
                {
                        className: 'absolute bottom-0 w-full min-h-[120px] max-h-[calc(100vh-168px)] h-[320px] bg-[rgb(44,44,44)]', //
                },
                [
                        _(
                                'div',
                                {
                                        key: 'top', //
                                        ref: drag.ref, //
                                        className: 'pl-4 flex items-center border-1 h-10 border-y-1 border-y border-[rgb(68,68,68)]',
                                },
                                _(
                                        'span',
                                        {
                                                className: 'font-bold text-[11px] select-none', //
                                        },
                                        'Layers'
                                )
                        ),
                        _(
                                'div',
                                {
                                        key: 'bottom', //
                                        className: 'pl-4 text-[11px]',
                                },
                                children
                        ),
                ]
        )
}
