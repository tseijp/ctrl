'use client'

import { dragEvent } from '../helpers/drag'
import { create as e } from '../index'

function getInputValue(e: Event) {
        if (e.target instanceof HTMLInputElement) return e.target.valueAsNumber
        throw ``
}

interface Props {
        icon?: string
        value: number
        set?: (x: number) => void
}

export function InputValue(props: Props) {
        const { icon = '', value, set } = props

        let input: HTMLInputElement
        let span: HTMLSpanElement
        let init: number

        const drag = dragEvent(() => {
                drag.event?.stopPropagation()
                if (drag.isDragStart) span.style.cursor = 'ew-resize'
                if (drag.isDragEnd) span.style.cursor = ''
                if (drag.isDragging) {
                        const { offset } = drag
                        const x = init + offset[0]
                        input.valueAsNumber = x << 0
                        if (set) set(x)
                }
        })
        const ref = (el: HTMLLabelElement) => {
                if (!el) return // @ts-ignore
                ;[span, input] = Array.from(el.childNodes)
                if (!(span instanceof HTMLSpanElement)) return
                if (!(input instanceof HTMLInputElement)) return
                init = input.valueAsNumber
                drag.offset[0] = init
                drag.onMount(span)
        }

        const el = e('label', { ref, className: 'relative' }, [
                e(
                        'span',
                        {
                                key: 'icon',
                                className: 'w-6 h-6 absolute grid place-content-center select-none',
                        },
                        icon
                ),
                e('input', {
                        key: 'input',
                        type: 'number',
                        className: 'pl-6 h-6 w-full bg-[#383838] rounded-sm outline-none',
                        valueAsNumber: value,
                        onchange: set
                                ? (e: Event) => set(getInputValue(e))
                                : null,
                }),
        ])

        return el
}
