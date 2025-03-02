import InputLabel from '../clients/InputLabel'
import { Attach, ctrl, SelectOptions, Target } from '../index'

type Arg = SelectOptions

export default function Select<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props
        const { options } = a as Arg

        const change = (e: Event) => {
                const el = e.target
                if (!(el instanceof HTMLSelectElement)) return
                const value = el.value
                a.options = [value, ...options.filter((item) => item !== value)]
                c.set(k, a)
        }

        const ref = (el: HTMLSelectElement | null) => {
                if (!el) return
                el.addEventListener('change', change)

                const update = (key: K, arg: Arg) => {
                        if (key !== k) return
                        el.value = arg.options[0]
                }

                const clean = () => {
                        c.updates.delete(update)
                }

                c.updates.add(update)
                c.cleanups.add(clean)
        }

        const _ = ctrl.create

        return _('fieldset', {}, [
                _(InputLabel, {
                        key: 'key', //
                        k,
                }),
                _(
                        'select',
                        {
                                ref,
                                key: 'select',
                                className: '_ctrl-input bg-[#383838] rounded-sm px-2 py-1 leading-[20px] block',
                        },
                        options.map((value, index) =>
                                _(
                                        'option',
                                        {
                                                value, //
                                                key: `${index}`,
                                        },
                                        value
                                )
                        )
                ),
        ])
}
