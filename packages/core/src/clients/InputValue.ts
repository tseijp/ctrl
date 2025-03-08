import { ctrl } from '../index'
import { dig, is, sig } from '../helpers/utils'
import { dragEvent } from '../helpers/drag'

interface Props {
        icon?: string
        value: number
        _ref?: (el: HTMLInputElement) => () => void
        _set?: (x: number | ((p: number) => number)) => void
}

export function InputValue(props: Props) {
        const { icon = '', value, _ref, _set } = props

        let clean = () => {}

        const ref = (el: HTMLLabelElement) => {
                if (!el) return clean()
                const children = Array.from(el.childNodes)
                const [span, input] = children as HTMLElement[]
                if (!(span instanceof HTMLSpanElement)) return
                if (!(input instanceof HTMLInputElement)) return

                const next = (p: number) => {
                        const { delta } = drag
                        let [dx] = delta
                        let a = dig(p) - 3
                        let b = a
                        a = Math.pow(10, a)
                        a *= dx
                        a = sig(a, b)
                        let x = p + a
                        x = sig(x, -2) // 0.01
                        return x
                }

                const drag = dragEvent(() => {
                        if (!_set) return
                        drag.event?.stopPropagation()
                        if (drag.isDragStart) span.style.cursor = 'ew-resize'
                        if (drag.isDragEnd) span.style.cursor = ''
                        if (drag.isDragging) _set(next)
                })

                const change = (e: Event) => {
                        if (!_set) return
                        const el = e.target
                        if (!(el instanceof HTMLInputElement)) return
                        let x = parseFloat(el.value)
                        if (is.nan(x)) x = 0
                        _set(x)
                }

                drag.onMount(span)
                if (_ref) clean = _ref(input)
                input.addEventListener('input', change)
        }

        const _ = ctrl.create
        return _(
                'label',
                {
                        ref,
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
                                className: '_ctrl-number pl-6 h-6 w-full bg-[#383838] rounded-sm outline-none',
                                defaultValue: `${value}`,
                        }),
                ]
        )
}
