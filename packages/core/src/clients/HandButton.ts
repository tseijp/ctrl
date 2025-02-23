import { ctrl } from '../index'

let _isGrab = false

export const isGrab = () => _isGrab

const ref = (el: HTMLButtonElement | null) => {
        if (!el) return
        const click = () => {
                _isGrab = !_isGrab
                el.style.backgroundColor = _isGrab ? '#0B8CE9' : 'transparent'
                document.body.style.cursor = _isGrab ? 'grab' : ''
        }
        el.addEventListener('click', click)
}

export default function HandButton() {
        const _ = ctrl.create
        return _(
                'button',
                {
                        ref, //
                        className: '_ctrl-button w-10 hover:bg-[#0B8CE9]',
                },
                _('img', {
                        src: 'https://r.tsei.jp/ctrl/hand.svg',
                        alt: '🖐️',
                        key: 'hand',
                        width: 20,
                        height: 20,
                })
        )
}
