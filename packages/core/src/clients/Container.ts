'use client'

import { dragEvent } from '../helpers/drag'
import { merge } from '../helpers/utils'
import { create as _ } from '../index'

export default function Container() {
        const { ref } = dragEvent((drag) => {
                const { offset } = drag
                const [x, y] = offset
                const transform = `translate(${x}px, ${y}px)`
                const el = drag.target as HTMLDivElement
                merge(el.style, { transform })
        })

        return _(
                'div',
                {
                        ref,
                        className: 'fixed bg-[#2c2c2c] w-[240px] pl-4 pr-2 pb-3 text-[12px] text-white',
                },
                _(
                        'div',
                        {
                                key: 'Container', //
                                className: 'leading-[40px] font-medium',
                        },
                        'Layout'
                )
        )
}
