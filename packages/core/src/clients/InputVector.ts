'use client'

import { ctrl, Config } from '../index'
import { is } from '../helpers/utils'
import { InputValue } from './InputValue'

interface Props<T extends Config> {
        x: number
        y?: number
        z?: number
        _x?: (x: number) => void
        _y?: (y: number) => void
        _z?: (z: number) => void
        k: keyof T
}

export default function InputVector<T extends Config>(props: Props<T>) {
        const { k } = props
        const keys = ['x', 'y', 'z'] as const
        const _ = ctrl.create

        const values = keys.map((key) => {
                const value = props[key]
                if (!is.num(value)) return null
                const icon = key.toUpperCase()
                const set = props[('_' + key) as '_x']
                return _(InputValue, { icon, key, value, set })
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
                        values
                ),
        ])
}
