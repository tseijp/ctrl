'use client'

import { Attach, ctrl, Target } from '../index'
import { InputValue } from '../clients/InputValue'
import InputLabel from '../clients/InputLabel'

type Arg = number

export default function Float<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T
        const { a, c, k } = props

        const _set = (value: number) => c.set(k, value as T[K])

        const _ref = (el: HTMLInputElement) => {
                const update = (key: K, arg: Arg) => {
                        if (k !== key) return
                        el.value = `${arg}`
                }
                c.updates.add(update)
                return () => {
                        c.updates.delete(update)
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
                        _(InputValue, {
                                icon: 'X',
                                value: a,
                                _set,
                                _ref,
                        })
                ),
        ])
}
