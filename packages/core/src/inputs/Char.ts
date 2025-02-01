'use client'

import { ctrl, Config, Ctrl } from '../index'

interface Props<T extends Config> {
        a: string
        c: Ctrl<T>
        k: keyof T
}

export default function Char<T extends Config>(props: Props<T>) {
        const { a, c, k } = props

        const change = (e: Event) => {
                const { target } = e
                if (!(target instanceof HTMLInputElement)) return
                const { checked } = target
                c.set(k, checked as T[keyof T])
        }

        let clean = () => {}

        const ref = (el: HTMLInputElement) => {
                if (!el) return clean()
                el.addEventListener('change', change)
                el.defaultValue = a

                const update = (key: string, value: string) => {
                        if (key !== k) return
                        el.value = value
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
                        className: '_ctrl-input',
                        defaultValue: a,
                }),
        ])
}
