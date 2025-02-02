'use client'

import { ctrl, Config, Ctrl } from '../index'
import { is } from '../helpers/utils'
import { InputValue } from '../clients/InputValue'

interface Props<T extends Config> {
        a: number[]
        c: Ctrl<T>
        k: keyof T
}

const keys = ['X', 'Y', 'Z']

export default function Vector<T extends Config>(props: Props<T>) {
        const { a, c, k } = props

        const _ = ctrl.create

        const children = [0, 1, 2].map((_012) => {
                const key = keys[_012]
                const value = a[_012]
                if (!is.num(value)) return null

                const set = (value: number) => {
                        a[_012] = value
                        c.set(k, [...a] as T[keyof T])
                }

                const _ref = (el: HTMLInputElement) => {
                        const update = (key: string, args: number[]) => {
                                if (k !== key) return
                                el.value = args[_012].toString()
                        }
                        c.updates.add(update)
                        return () => {
                                c.updates.delete(update)
                        }
                }

                return _(InputValue, { icon: key, key, value, set, _ref })
        })

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
                        children
                ),
        ])
}
