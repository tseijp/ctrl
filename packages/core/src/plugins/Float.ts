import { Attach, ctrl, isU, Target } from '../index'
import { InputValue } from '../clients/InputValue'
import InputLabel from '../clients/InputLabel'
import { fig, is } from '../helpers/utils'

type Arg = number

export default function Float<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props

        const _set = (next: number | ((p: number) => number)) => {
                if (is.fun(next)) {
                        let a = c.current[k]
                        if (isU(a)) a = a.value
                        next = next(a)
                }
                c.set(k, next as T[K])
        }

        const _ref = (el: HTMLInputElement) => {
                const run = (key: K, arg: Arg) => {
                        if (k !== key) return
                        el.value = `${arg}`
                }

                c.events.add(run)
                c.cleans.add(() => {
                        c.events.delete(run)
                })
        }

        const _ = ctrl.create

        return _('fieldset', {}, [
                _(InputLabel, { key: 'key', k }),
                _(
                        'div',
                        {
                                key: 'values',
                                className: 'grid gap-x-2 grid-cols-[1fr_1fr_1fr]',
                        },
                        _(InputValue, {
                                icon: 'X',
                                value: a,
                                _set,
                                _ref,
                        })
                ),
        ])
}
