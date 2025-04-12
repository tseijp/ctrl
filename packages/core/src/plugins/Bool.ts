import InputLabel from '../clients/InputLabel'
import { Attach, ctrl, Target } from '../index'

type Arg = boolean

export default function Bool<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props

        const change = (e: Event) => {
                const { target } = e
                if (!(target instanceof HTMLInputElement)) return
                const { checked } = target
                c.set(k, checked as T[K])
        }

        const ref = (el: HTMLInputElement | null) => {
                if (!el) return c.cache[k]?.()
                el.addEventListener('change', change)
                el.defaultChecked = a

                const run = (key: K, arg: Arg) => {
                        if (key !== k) return
                        el.checked = arg
                }

                c.writes.add(run)
                c.cache[k] = () => {
                        c.writes.delete(run)
                        el.removeEventListener('change', change)
                }
        }

        const _ = ctrl.create

        return _(
                'fieldset',
                {
                        id: `${c.id}.${k}`,
                },
                _(
                        InputLabel, //
                        {
                                key: 'key', //
                                k,
                        }
                ),
                _(
                        'input', //
                        {
                                ref,
                                key: 'input',
                                className: 'mb-1',
                                defaultChecked: a,
                                type: 'checkbox',
                        }
                )
        )
}
