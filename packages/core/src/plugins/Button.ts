import InputLabel from '../clients/InputLabel'
import { Attach, ButtonOnClick, ctrl, Target } from '../index'

type Arg = ButtonOnClick

export default function Button<T extends Target>(props: Attach<Arg, T>) {
        const { a, k } = props
        const { onclick } = a

        const ref = (el: HTMLButtonElement | null) => {
                if (!el) return
                el.addEventListener('click', onclick)
        }

        const _ = ctrl.create

        return _(
                'fieldset',
                {
                        className: 'mr-2',
                },
                [
                        _(InputLabel, { key: 'key', k }),
                        _(
                                'button',
                                {
                                        ref,
                                        key: 'button',
                                        className: 'mb-1 _ctrl-input w-full rounded-sm px-2 py-1 bg-[#383838] cursor-pointer',
                                },
                                k
                        ),
                ]
        )
}
