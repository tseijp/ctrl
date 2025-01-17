'use client'

import ctrl from '../index'

export default function ControlRight(props: any) {
        const { children } = props
        const _ = ctrl.create
        return _(
                'aside',
                {
                        key: 'right', //
                        className: '_ctrl-aside right-0',
                },
                [
                        _(
                                'div',
                                {
                                        key: 'top',
                                        className: 'h-10 border-1 border-y border-[rgb(68,68,68)]',
                                },
                                _(
                                        'span',
                                        {
                                                key: 'span',
                                                className: 'mx-4 leading-10 font-bold',
                                        }
                                        // q ? 'Update' : 'New Creation'
                                )
                        ),
                        _(
                                'div',
                                {
                                        id: 'ctrl-container',
                                        key: 'container',
                                },
                                children
                        ),
                ]
        )
}
