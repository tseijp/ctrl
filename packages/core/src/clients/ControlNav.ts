'use client'

import { ctrl } from '../index'
import ZoomStore from './ZoomStore'

export default function ControlNav() {
        const _ = ctrl.create
        return _(
                'nav',
                {
                        key: 'nav', //
                        className: '_ctrl-nav',
                },
                [
                        _(
                                'div',
                                {
                                        key: 'left', //
                                        className: 'flex',
                                },
                                [
                                        _(
                                                'button',
                                                {
                                                        key: 'neko',
                                                        className: '_ctrl-button gap-0.5 w-[50px] bg-[rgb(11,140,233)]',
                                                },
                                                [
                                                        _('img', {
                                                                src: 'https://r.tsei.jp/ctrl/ungra.svg',
                                                                alt: '😺',
                                                                key: 'neko',
                                                                width: 24,
                                                                height: 19,
                                                        }),
                                                        _('img', {
                                                                src: 'https://r.tsei.jp/ctrl/arrow.svg',
                                                                alt: '🔽',
                                                                key: 'arrow',
                                                                width: 8,
                                                                height: 7,
                                                        }),
                                                ]
                                        ),
                                        _(
                                                'button',
                                                {
                                                        key: 'move',
                                                        className: '_ctrl-button w-10',
                                                },
                                                _('img', {
                                                        src: 'https://r.tsei.jp/ctrl/move.svg',
                                                        alt: '👆',
                                                        key: 'move',
                                                        width: 18,
                                                        height: 18,
                                                })
                                        ),
                                        _(
                                                'button',
                                                {
                                                        key: 'hand',
                                                        className: '_ctrl-button w-10',
                                                },
                                                _('img', {
                                                        src: 'https://r.tsei.jp/ctrl/hand.svg',
                                                        alt: '🖐️',
                                                        key: 'hand',
                                                        width: 20,
                                                        height: 20,
                                                })
                                        ),
                                        _(
                                                'button',
                                                {
                                                        key: 'comment',
                                                        className: '_ctrl-button w-10',
                                                },
                                                _('img', {
                                                        src: 'https://r.tsei.jp/ctrl/comment.svg',
                                                        alt: '💬',
                                                        key: 'comment',
                                                        width: 20,
                                                        height: 20,
                                                })
                                        ),
                                ]
                        ),
                        _(
                                'button',
                                {
                                        key: 'right', //
                                        className: '_ctrl-button gap-1 px-3.5',
                                },
                                [
                                        _(
                                                'span',
                                                {
                                                        key: 'zoom', // @TODO
                                                        className: 'text-[11px]',
                                                },
                                                _(ZoomStore)
                                        ),
                                        _('img', {
                                                src: 'https://r.tsei.jp/ctrl/arrow.svg',
                                                alt: '🔽',
                                                key: 'arrow',
                                                width: 8,
                                                height: 7,
                                        }),
                                ]
                        ),
                ]
        )
}
