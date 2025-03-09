import InputLabel from '../clients/InputLabel'
import { Attach, ctrl, ImageSource, Target } from '../index'

type Arg = ImageSource

export default function Image<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props
        const { src, alt } = a as Arg

        const change = (e: Event) => {
                const el = e.target
                if (!(el instanceof HTMLInputElement)) return
                a.src = el.value
                c.set(k, a)
        }

        const ref = (el: HTMLInputElement | null) => {
                if (!el) return
                el.addEventListener('change', change)

                const update = (key: K, arg: Arg) => {
                        if (key !== k) return
                        el.value = arg.src
                }

                const clean = () => {
                        c.updates.delete(update)
                }

                c.updates.add(update)
                c.cleanups.add(clean)
        }

        const _ = ctrl.create

        return _(
                'fieldset',
                {
                        className: 'mr-2',
                },
                [
                        _(InputLabel, {
                                key: 'key', //
                                k,
                        }),
                        _('input', {
                                ref,
                                src,
                                alt,
                                type: 'image',
                                key: 'input',
                                className: '_ctrl-input bg-[#383838] max-w-full rounded-sm px-2 py-1 leading-[20px] block',
                        }),
                ]
        )
}
