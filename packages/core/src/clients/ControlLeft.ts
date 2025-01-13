'use client'

import ctrl from '../index'

export default function ControlLeft() {
        const _ = ctrl.create
        return _(
                'aside',
                {
                        key: 'left', //
                        className: '_ctrl-aside left-0',
                },
                [
                        _(
                                'div',
                                {
                                        key: 'top',
                                        className: 'flex border-1 h-10 border-y-1 border-y border-[rgb(68,68,68)]',
                                },
                                [
                                        _(
                                                'button',
                                                {
                                                        key: 'search',
                                                        className: '_ctrl-button px-2.5 ml-1.5',
                                                },
                                                _('img', {
                                                        src: 'https://r.tsei.jp/ctrl/find.svg',
                                                        alt: '🔍',
                                                        width: 16,
                                                        height: 16,
                                                })
                                        ),
                                        _('input', {
                                                key: 'input',
                                                className: '_ctrl-input',
                                                placeholder: 'Find...',
                                        }),
                                ]
                        ),
                        _('ul', {
                                key: 'list', // @TODO
                                className: 'px-4 text-sm',
                        }),
                ]
        )
}
