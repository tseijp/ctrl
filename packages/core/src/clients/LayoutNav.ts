import ZoomPercent from './ZoomPercent'
import { create as _ } from '../index'

export default function LayoutNav() {
        return _('nav', {}, [
                _('div', { className: 'flex' }, [
                        _(
                                'button',
                                {
                                        className: 'gap-0.5 w-[50px] bg-out-of-the-blue',
                                },
                                [
                                        _('img', {
                                                src: '/icons/ungra.svg',
                                                alt: '😺',
                                                width: 24,
                                                height: 19,
                                        }),
                                        _('img', {
                                                src: '/icons/arrow.svg',
                                                alt: '🔽',
                                                width: 8,
                                                height: 7,
                                        }),
                                ]
                        ),
                        _(
                                'button',
                                { className: 'w-10' },
                                _('img', {
                                        src: '/icons/move.svg',
                                        alt: '👆',
                                        width: 18,
                                        height: 18,
                                })
                        ),
                        _(
                                'button',
                                { className: 'w-10' },
                                _('img', {
                                        src: '/icons/hand.svg',
                                        alt: '🖐️',
                                        width: 20,
                                        height: 20,
                                })
                        ),
                        _(
                                'button',
                                { className: 'w-10' },
                                _('img', {
                                        src: '/icons/comment.svg',
                                        alt: '💬',
                                        width: 20,
                                        height: 20,
                                })
                        ),
                ]),
                _('button', { className: 'gap-1 px-3.5' }, [
                        _('span', { className: 'text-[11px]' }, _(ZoomPercent)),
                        _('img', {
                                src: '/icons/arrow.svg',
                                alt: '🔽',
                                width: 8,
                                height: 7,
                        }),
                ]),
        ])
}
