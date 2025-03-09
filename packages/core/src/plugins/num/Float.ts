import { Attach, ctrl, dragEvent, isU, Target } from '../../index'
import InputLabel from '../../clients/InputLabel'
import { dig, is, sig } from '../../helpers/utils'

type Arg = number

export default function Float<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props

        const _set = (next: number | ((p: number) => number)) => {
                if (is.fun(next)) {
                        let a = c.current[k]
                        if (isU(a)) a = a.value
                        next = next(a)
                }
                c.set(k, next as T[K])
        }

        const ref = (el: HTMLLabelElement | null) => {
                if (!el) return c.cache[k]?.()

                const children = Array.from(el.children)
                const [span, input] = children
                if (!(input instanceof HTMLInputElement)) return
                if (!(span instanceof HTMLSpanElement)) return

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
                        let x = parseFloat(input.value)
                        if (is.nan(x)) x = 0
                        _set(x)
                }

                const run = (key: K, arg: Arg) => {
                        if (k !== key) return
                        input.value = `${arg}`
                }

                c.events.add(run)
                drag.onMount(span)
                input.addEventListener('input', change)

                c.cache[k] = () => {
                        c.events.delete(run)
                        drag.onClean()
                        input.removeEventListener('input', change)
                }
        }

        const _ = ctrl.create

        return _('fieldset', {}, [
                _(InputLabel, { key: 'key', k }),
                _(
                        'div',
                        {
                                key: 'values',
                                className: 'grid gap-x-2 grid-cols-[1fr_1fr_1fr]',
                        },
                        _(
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
                                                'X'
                                        ),
                                        _('input', {
                                                key: 'input',
                                                type: 'number',
                                                className: '_ctrl-number pl-6 h-6 w-full bg-[#383838] rounded-sm outline-none',
                                                defaultValue: `${a}`,
                                        }),
                                ]
                        )
                ),
        ])
}
