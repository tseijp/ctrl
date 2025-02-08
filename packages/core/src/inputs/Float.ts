'use client'

import { ctrl, Ctrl, Target } from '../index'
import { InputValue } from '../clients/InputValue'

interface Props<T extends Target> {
        a: number
        c: Ctrl<T>
        k: keyof T
}

export default function Float<T extends Target>(props: Props<T>) {
        const { a, c, k } = props

        const set = (value: number) => c.set(k, value as T[keyof T])

        const _ref = (el: HTMLInputElement) => {
                const update = (key: string, args: number) => {
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
