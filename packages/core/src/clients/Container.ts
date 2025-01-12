'use client'

import { dragEvent } from '../helpers/drag'
import { merge } from '../helpers/utils'
import { create as e } from '../index'

export default function Container() {
        const { ref } = dragEvent((drag) => {
                const { offset } = drag
                const [x, y] = offset
                merge(drag.target as HTMLDivElement, {
                        style: { transform: `translate(${x}, ${y})` },
                })
        })

        return e(
                'div',
                {
                        ref,
                        className: 'fixed bg-[#2c2c2c] w-[240px] pl-4 pr-2 pb-3 text-[12px] text-white',
                },
                e('div', { className: 'leading-[40px] font-medium' }, 'Layout')
        )
}
