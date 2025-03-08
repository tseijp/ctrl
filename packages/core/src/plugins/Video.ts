import InputLabel from '../clients/InputLabel'
import { Attach, ctrl, Target, VideoSource } from '../index'

type Arg = VideoSource

export default function Video<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props
        const { src } = a as Arg

        const change = (e: Event) => {
                const el = e.target
                if (!(el instanceof HTMLInputElement)) return
                if (!el.files || el.files.length === 0) return
                const video = el.nextElementSibling!
                if (!(video instanceof HTMLVideoElement)) return
                const file = el.files[0]
                a.src = video.src = URL.createObjectURL(file)
                c.set(k, a)
        }

        const ref = (el: HTMLInputElement | null) => {
                if (!el) return
                el.addEventListener('change', change)

                const update = (key: K, arg: Arg) => {
                        if (key !== k) return
                        const video =
                                el.nextElementSibling as HTMLVideoElement | null
                        if (video) video.src = arg.src
                }

                const clean = () => {
                        c.updates.delete(update)
                        if (el) el.removeEventListener('change', change)
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
                                key: 'key',
                                k,
                        }),
                        _(
                                'label',
                                {
                                        key: 'container',
                                        className: '_ctrl-input flex flex-col items-end rounded-sm px-2 py-2 bg-[#383838] cursor-pointer',
                                },
                                [
                                        _('input', {
                                                ref,
                                                type: 'file',
                                                accept: 'video/*',
                                                key: 'input',
                                                className: 'hidden',
                                        }),
                                        _('video', {
                                                src,
                                                controls: true,
                                                key: 'video',
                                                className: 'w-full max-w-full',
                                        }),
                                        _(
                                                'span',
                                                {
                                                        key: 'label',
                                                        className: 'mt-2 underline opacity-70 text-[10px]',
                                                },
                                                'upload'
                                        ),
                                ]
                        ),
                ]
        )
}
