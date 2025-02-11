'use client'

import InputLabel from '../clients/InputLabel'
import { Attach, ctrl, Target } from '../index'

type Arg = boolean

export default function Bool<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T
        const { a, c, k } = props

        const change = (e: Event) => {
                const { target } = e
                if (!(target instanceof HTMLInputElement)) return
                const { checked } = target
                c.set(k, checked as T[K])
        }

        let clean = () => {}

        const ref = (el: HTMLInputElement) => {
                if (!el) return clean()
                el.addEventListener('change', change)
                el.defaultChecked = a

                const update = (key: K, arg: Arg) => {
                        if (key !== k) return
                        el.checked = arg
                }

                c.updates.add(update)

                clean = () => {
                        c.updates.delete(update)
                }
        }

        const _ = ctrl.create

        return _('div', {}, [
                _(InputLabel, { key: 'key', k }),
                _('input', {
                        ref,
                        key: 'input',
                        defaultChecked: a,
                        type: 'checkbox',
                }),
        ])
}
