'use client'

import { Attach, ctrl, Target, XYZVector } from '../index'
import { InputValue } from '../clients/InputValue'
import { is } from '../helpers/utils'
import InputLabel from '../clients/InputLabel'

type Arg = number[] | XYZVector

const ids = [0, 1, 2, 3] as const
const keys: (keyof XYZVector)[] = ['x', 'y', 'z', 'w']

export default function Vector<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props
        const _ = ctrl.create

        const children = ids.map((_0) => {
                const _x = keys[_0]

                const get = (arg: Arg) => {
                        const isXYZ = !is.arr(arg)
                        return isXYZ ? arg[_x]! : arg[_0]
                }

                const value = get(a)
                if (!is.num(value)) return null

                const _set = (next: number) => {
                        const isXYZ = !is.arr(a)
                        if (isXYZ) a[_x] = next
                        else a[_0] = next
                        c.set(k, a)
                }

                const _ref = (el: HTMLInputElement) => {
                        const update = (key: K, arg: Arg) => {
                                if (k !== key) return
                                el.value = `${get(arg)}`
                        }
                        c.updates.add(update)
                        return () => {
                                c.updates.delete(update)
                        }
                }

                return _(InputValue, {
                        icon: _x?.toUpperCase(),
                        key: _x,
                        value,
                        _set,
                        _ref,
                })
        })

        return _('fieldset', {}, [
                _(InputLabel, { key: 'key', k }),
                _(
                        'div',
                        {
                                key: 'values',
                                className: 'grid gap-x-2 grid-cols-[1fr_1fr_1fr]',
                        },
                        children
                ),
        ])
}
