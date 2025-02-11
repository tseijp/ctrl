'use client'

import { Attach, ctrl, Target } from '../index'

type Arg = null

export default function Null<T extends Target>(props: Attach<Arg, T>) {
        const { k, children = 'null' } = props

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
