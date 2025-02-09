'use client'

import { ctrl, Ctrl, Target } from '../index'

type Arg = boolean

interface Props<T extends Target, K extends keyof T = keyof T> {
        a: Arg & T[K]
        c: Ctrl<T>
        k: K
}

export default function Bool<T extends Target>(props: Props<T>) {
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
                _(
                        'div',
                        {
                                key: 'key',
                                className: 'text-[10px] leading-[14px] mt-1',
                        },
                        k as string
                ),
                _('input', {
                        ref,
                        key: 'input',
                        defaultChecked: a,
                        type: 'checkbox',
                }),
        ])
}
