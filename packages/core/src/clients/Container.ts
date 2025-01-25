'use client'

import ctrl from '../index'
import { dragEvent } from '../helpers/drag'
import { is, merge } from '../helpers/utils'

export default function Container(props: any) {
        const { children, title = 'Unknown' } = props
        const _children = is.arr(children) ? children : [children]
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
                        ref,
                        style: { zIndex: '9999' },
                        className: '_ctrl-container bg-[#2c2c2c] max-w-[240px] pl-4 pr-2 pb-3 text-[12px] text-white',
                },
                [
                        _(
                                'div',
                                {
                                        key: 'Container', //
                                        className: 'leading-[40px] font-medium',
                                },
                                title
                        ),
                        ..._children,
                ]
        )
}
