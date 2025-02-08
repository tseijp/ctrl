'use client'

import { ctrl, Ctrl, Target } from '../index'

interface Props<T extends Target> {
        a: boolean
        c: Ctrl<T>
        k: keyof T
        children?: string
}

export default function Null<T extends Target>(props: Props<T>) {
        const { a, k, children = 'null' } = props

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
                                key: 'null', //
                                className: 'font-normal opacity-20',
                        },
                        children
                ),
        ])
}
