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
                if (!el.files || el.files.length === 0) return
                const img = el.nextElementSibling!
                if (!(img instanceof HTMLImageElement)) return
                const file = el.files[0]
                const url = URL.createObjectURL(file)
                a.src = img.src = url
                c.set(k, a)
        }

        const ref = (el: HTMLInputElement | null) => {
                if (!el) return c.cache[k]?.()
                el.addEventListener('change', change)

                const run = (key: K, arg: Arg) => {
                        if (key !== k) return
                        const img = el.nextElementSibling!
                        if (!(img instanceof HTMLImageElement)) return
                        img.src = arg.src
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
                        className: 'mr-2',
                },
                [
                        _(InputLabel, {
                                key: 'key', //
                                k,
                        }),
                        _(
                                'label',
                                {
                                        key: 'container', //
                                        className: '_ctrl-input flex rounded-sm px-2 py-2 bg-[#383838] cursor-pointer',
                                },
                                [
                                        _('input', {
                                                ref,
                                                type: 'file',
                                                accept: 'image/*',
                                                key: 'input',
                                                className: 'hidden',
                                        }),
                                        _('img', {
                                                src,
                                                alt,
                                                key: 'img',
                                        }),
                                ]
                        ),
                ]
        )
}
