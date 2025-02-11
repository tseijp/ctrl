'use client'

import { ctrl } from '../index'
import { dragEvent } from '../helpers/drag'
import { merge } from '../helpers/utils'

interface Props {
        children?: any
        title?: string
        isDraggable?: boolean
}

export default function Container(props: Props) {
        const { children, title = 'default', isDraggable } = props
        const { ref } = dragEvent((drag) => {
                const { offset } = drag
                const [x, y] = offset
                const transform = `translate(${x}px, ${y}px)`
                const el = drag.target as HTMLDivElement
                merge(el.style, { transform })
        })

        const _ = ctrl.create
        return _(
                'div',
                {
                        ref: isDraggable ? ref : void 0,
                        style: { zIndex: '9999' },
                        className: '_ctrl-container bg-[#2c2c2c] max-w-[240px] pl-4 pr-2 pb-3 text-[12px] text-white',
                },
                [
                        _(
                                'div',
                                {
                                        key: '0', //
                                        className: 'h-10 grid items-center',
                                },
                                _(
                                        'div',
                                        {
                                                className: 'font-[11px] leading-[16px] font-bold',
                                        },
                                        title
                                )
                        ),
                        _(
                                'div', //
                                {
                                        key: '1', //
                                },
                                children
                        ),
                ]
        )
}
