import { ctrl, fullscreen } from '../index'
import HandButton from './HandButton'
import NavDropdown from './NavDropdown'

const dbclick = () => {
        fullscreen(document.body as HTMLDivElement)
}

const ref = (el: HTMLElement | null) => {
        if (!el) return
        el.addEventListener('dblclick', dbclick)
}

export default function ControlNav() {
        const _ = ctrl.create
        return _(
                'nav',
                {
                        ref,
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
                                                HandButton, //
                                                {
                                                        key: 'hand', //
                                                }
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
                                NavDropdown, //
                                {
                                        key: 'dropdown', //
                                }
                        ),
                ]
        )
}
