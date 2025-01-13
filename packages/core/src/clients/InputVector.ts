'use client'

import ctrl from '../index'
import { is } from '../helpers/utils'
import { InputValue } from './InputValue'

interface Props {
        x: number
        y?: number
        z?: number
        _x?: (x: number) => void
        _y?: (y: number) => void
        _z?: (z: number) => void
        k: string
}

export default function InputVector(props: Props) {
        const { k } = props
        const keys = ['x', 'y', 'z'] as const
        const values = keys.map((key) => {
                const value = props[key]
                if (!is.num(value)) return null
                const icon = key.toUpperCase()
                const set = props[('_' + key) as '_x']
                return _(InputValue, { icon, key, value, set })
        })

        const _ = ctrl.create
        return _('div', {}, [
                _(
                        'div',
                        {
                                key: 'key',
                                className: 'text-[10px] leading-[14px] mt-1',
                        },
                        k
                ),
                _(
                        'div',
                        {
                                key: 'values',
                                className: 'grid gap-x-2 grid-cols-[88px_88px_24px]',
                        },
                        values
                ),
        ])
}
