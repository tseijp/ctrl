import { Attach, ctrl, dragEvent, isU, Target, XYZVector } from '../../index'
import { dig, is, sig } from '../../helpers/utils'
import InputLabel from '../../clients/InputLabel'

type Arg = number[] | XYZVector

const ids = [0, 1, 2, 3] as const
const keys: (keyof XYZVector)[] = ['x', 'y', 'z', 'w']

export default function Vector<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props
        const _ = ctrl.create

        if (!c.cache[k]) c.cache[k] = {}

        const children = ids.map((_0) => {
                const _x = keys[_0]

                const get = (arg: Arg) => {
                        const isXYZ = !is.arr(arg)
                        return isXYZ ? arg[_x]! : arg[_0]
                }

                const value = get(a)
                if (!is.num(value)) return null

                const _set = (next: number | ((p: number) => number)) => {
                        let _a = c.current[k]
                        if (isU(_a)) _a = _a.value
                        const isXYZ = !is.arr(_a)
                        if (is.fun(next)) {
                                if (isXYZ) next = next(_a[_x])
                                else next = next(_a[_0])
                        }
                        if (isXYZ) _a[_x] = next
                        else _a[_0] = next
                        c.set(k, _a)
                }

                const ref = (el: HTMLLabelElement | null) => {
                        if (!el) return c.cache[k]?.[_0]?.()
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
                                input.value = `${x}`
                                return x
                        }

                        const drag = dragEvent(() => {
                                if (!_set) return
                                drag.event?.stopPropagation()
                                if (drag.isDragStart)
                                        span.style.cursor = 'ew-resize'
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

                        const run = (key: K, arg: Arg) => {
                                if (k !== key) return
                                input.value = `${get(arg)}`
                        }

                        c.writes.add(run)
                        drag.onMount(span)
                        input.addEventListener('input', change)

                        c.cache[k][_0] = () => {
                                c.writes.delete(run)
                                drag.onClean()
                                input.removeEventListener('input', change)
                        }
                }
                return _(
                        'label',
                        {
                                ref,
                                key: _x,
                                className: 'relative',
                        },
                        [
                                _(
                                        'span',
                                        {
                                                key: 'icon',
                                                className: 'w-6 h-6 absolute grid place-content-center select-none',
                                        },
                                        _x?.toUpperCase()
                                ),
                                _('input', {
                                        key: 'input',
                                        type: 'number',
                                        className: '_ctrl-number pl-6 h-6 w-full bg-[#383838] rounded-sm outline-none',
                                        defaultValue: `${value}`,
                                }),
                        ]
                )
        })

        return _(
                'fieldset',
                {
                        id: `${c.id}.${k}`,
                        className: 'mr-2',
                },
                [
                        _(InputLabel, { key: 'key', k }),
                        _(
                                'div',
                                {
                                        key: 'values',
                                        className: 'grid gap-x-2 grid-cols-[1fr_1fr_1fr]',
                                },
                                children
                        ),
                ]
        )
}
