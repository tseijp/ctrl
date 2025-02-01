'use client'

import { ctrl } from '../index'
import { dragEvent } from '../helpers/drag'

function getInputValue(e: Event) {
        if (e.target instanceof HTMLInputElement) return e.target.valueAsNumber
        throw ``
}

function sig(value: number, digit: number) {
        digit *= -1
        digit = Math.pow(10, digit)
        value *= digit
        value = Math.round(value)
        value /= digit
        return value
}

interface Props {
        icon?: string
        value: number
        _ref?: (el: HTMLInputElement) => () => void
        set?: (x: number) => void
}

export function InputValue(props: Props) {
        const { icon = '', value, _ref, set } = props

        let input: HTMLInputElement
        let span: HTMLSpanElement
        let init: number

        const drag = dragEvent(() => {
                drag.event?.stopPropagation()
                if (drag.isDragStart) span.style.cursor = 'ew-resize'
                if (drag.isDragEnd) span.style.cursor = ''
                if (drag.isDragging) {
                        const { offset } = drag
                        let x = init + offset[0] / 100
                        x = sig(x, -2)
                        input.valueAsNumber = x
                        if (set) set(x)
                }
        })

        const change = (e: Event) => {
                if (!set) return
                set(getInputValue(e))
        }

        let clean = () => {}

        const ref = (el: HTMLLabelElement) => {
                if (!el) return clean()
                const children = Array.from(el.childNodes) // @ts-ignore
                ;[span, input] = children
                if (!(span instanceof HTMLSpanElement)) return
                if (!(input instanceof HTMLInputElement)) return
                init = input.valueAsNumber
                drag.offset[0] = init
                drag.onMount(span)
                if (_ref) clean = _ref(input)
                input.addEventListener('change', change)
        }

        const _ = ctrl.create
        return _(
                'label',
                {
                        ref, //
                        className: 'relative',
                },
                [
                        _(
                                'span',
                                {
                                        key: 'icon',
                                        className: 'w-6 h-6 absolute grid place-content-center select-none',
                                },
                                icon
                        ),
                        _('input', {
                                key: 'input',
                                type: 'number',
                                step: '0.01',
                                className: '_ctrl-number pl-6 h-6 w-full bg-[#383838] rounded-sm outline-none',
                                defaultValue: value.toString(),
                        }),
                ]
        )
}
