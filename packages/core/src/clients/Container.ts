'use client'

import { ctrl, register } from '../index'
import { dragEvent } from '../helpers/drag'
import { merge } from '../helpers/utils'
import { PARENT_ID } from '../types'

let isInitialized = false

function initialize() {
        if (ctrl.parent) return
        if (isInitialized) return
        isInitialized = true
        register({
                parent: PARENT_ID,
        })
}

interface Props {
        children?: any
        title?: string
        isDraggable?: boolean
}

export default function Container(props: Props) {
        initialize()
        const { children, title = 'Unknown', isDraggable } = props
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
                                        key: 'Container', //
                                        className: 'leading-[40px] font-medium',
                                },
                                title
                        ),
                        _(
                                'div', //
                                {
                                        key: 'parent',
                                        id: PARENT_ID,
                                },
                                children
                        ),
                ]
        )
}
