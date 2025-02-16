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
        _set?: (x: number) => void
}

export function InputValue(props: Props) {
        const { icon = '', value, _ref, _set } = props

        let clean = () => {}

        const ref = (el: HTMLLabelElement) => {
                if (!el) return clean()

                const drag = dragEvent(() => {
                        // @ts-ignore
                        const { input, span, init } = drag.memo
                        drag.event?.stopPropagation()
                        if (drag.isDragStart) span.style.cursor = 'ew-resize'
                        if (drag.isDragEnd) span.style.cursor = ''
                        if (drag.isDragging) {
                                const { offset } = drag
                                let x = init + offset[0] / 100
                                x = sig(x, -2)
                                input.valueAsNumber = x
                                if (_set) _set(x)
                        }
                })

                const change = (e: Event) => {
                        if (!_set) return
                        const next = getInputValue(e)
                        _set(next)
                        // @ts-ignore
                        drag.memo.init = next
                        drag.offset[0] = 0
                }

                const children = Array.from(el.childNodes)
                const [span, input] = children
                if (!(span instanceof HTMLSpanElement)) return
                if (!(input instanceof HTMLInputElement)) return
                const init = input.valueAsNumber
                Object.assign(drag.memo, { span, input, init })
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
