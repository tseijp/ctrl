import ZoomPercent from './ZoomPercent'
import { create as _ } from '../index'

export default function LayoutNav() {
        return _('nav', {}, [
                _('div', { key: 'left', className: 'flex' }, [
                        _(
                                'button',
                                {
                                        key: 'neko',
                                        className: 'gap-0.5 w-[50px] bg-out-of-the-blue',
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
                                        className: 'w-10',
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
                                        className: 'w-10',
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
                                        className: 'w-10',
                                },
                                _('img', {
                                        src: 'https://r.tsei.jp/ctrl/comment.svg',
                                        alt: '💬',
                                        key: 'comment',
                                        width: 20,
                                        height: 20,
                                })
                        ),
                ]),
                _('button', { key: 'right', className: 'gap-1 px-3.5' }, [
                        _(
                                'span',
                                { key: 'zoom', className: 'text-[11px]' },
                                _(ZoomPercent)
                        ),
                        _('img', {
                                src: 'https://r.tsei.jp/ctrl/arrow.svg',
                                alt: '🔽',
                                key: 'arrow',
                                width: 8,
                                height: 7,
                        }),
                ]),
        ])
}
