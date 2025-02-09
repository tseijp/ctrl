'use client'

import { ctrl, Ctrl, Target } from '../index'
import { InputValue } from '../clients/InputValue'

type Arg = number

interface Props<T extends Target, K extends keyof T = keyof T> {
        a: Arg & T[K]
        c: Ctrl<T>
        k: K
}

export default function Float<T extends Target>(props: Props<T>) {
        type K = keyof T
        const { a, c, k } = props

        const set = (value: number) => c.set(k, value as T[K])

        const _ref = (el: HTMLInputElement) => {
                const update = (key: K, args: Arg) => {
                        if (k !== key) return
                        el.value = args.toString()
                }
                c.updates.add(update)
                return () => {
                        c.updates.delete(update)
                }
        }

        const _ = ctrl.create

        return _('div', {}, [
                _(
                        'div',
                        {
                                key: 'key',
                                className: 'text-[10px] leading-[14px] mt-1',
                        },
                        k as string
                ),
                _(
                        'div',
                        {
                                key: 'values',
                                className: 'grid gap-x-2 grid-cols-[1fr_1fr_1fr]',
                        },
                        _(InputValue, { icon: 'X', value: a, set, _ref })
                ),
        ])
}
