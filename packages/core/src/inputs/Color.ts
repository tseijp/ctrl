'use client'

import { Attach, ctrl, is, merge, RGBColor, Target } from '../index'

function hex2rgb(hex = '#fff') {
        hex = hex.replace('#', '')
        let rgba =
                hex.length <= 4
                        ? hex.split('').map((c) => c + c)
                        : hex.match(/.{1,2}/g) ?? []
        const [r, g, b, a] = rgba.map((x) => parseInt(x, 16) / 255)
        return { r, g, b, a }
}

function rgb2hex(color: RGBColor) {
        const { r = 1, g = 1, b = 1, a } = color
        const pad = (x: number) =>
                Math.round(x * 255)
                        .toString(16)
                        .padStart(2, '0')
        let hex = '#'
        hex += [r, g, b].map(pad).join('')
        if (a) hex += pad(a)
        return hex
}

type Arg = string | RGBColor

export default function Color<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T
        const { a, c, k } = props

        const change = (e: Event) => {
                const { target } = e
                if (!(target instanceof HTMLInputElement)) return
                const isRGB = !is.str(a)
                const hex = target.value
                const rgb = hex2rgb(hex)
                if (isRGB) {
                        merge(a, rgb)
                        c.set(k, a)
                } else c.set(k, hex as T[K])
        }

        let clean = () => {}

        const get = (arg: Arg) => {
                const isRGB = !is.str(arg)
                return isRGB ? rgb2hex(arg) : arg
        }

        const ref = (el: HTMLInputElement) => {
                if (!el) return clean()
                el.addEventListener('input', change)
                el.value = get(a)

                const update = (key: K, arg: Arg) => {
                        if (key !== k) return
                        el.value = get(arg)
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
                        defaultValue: get(a),
                        type: 'color',
                }),
        ])
}
