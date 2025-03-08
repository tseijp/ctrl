import InputLabel from '../clients/InputLabel'
import { Attach, AudioSource, ctrl, Target } from '../index'

type Arg = AudioSource

export default function Audio<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props
        const { src } = a as Arg

        const change = (e: Event) => {
                const el = e.target
                if (!(el instanceof HTMLInputElement)) return
                if (!el.files || el.files.length === 0) return
                const audio = el.nextElementSibling!
                if (!(audio instanceof HTMLAudioElement)) return
                const file = el.files[0]
                const url = URL.createObjectURL(file)
                a.src = audio.src = url
                c.set(k, a)
        }

        const ref = (el: HTMLInputElement | null) => {
                if (!el) return
                el.addEventListener('change', change)

                const update = (key: K, arg: Arg) => {
                        if (key !== k) return
                        const audio = el.nextElementSibling as HTMLAudioElement
                        if (audio) audio.src = arg.src
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
                                                accept: 'audio/*',
                                                key: 'input',
                                                className: 'hidden',
                                        }),
                                        _('audio', {
                                                src,
                                                controls: true,
                                                key: 'audio',
                                                className: 'w-full max-w-full',
                                        }),
                                        _(
                                                'span',
                                                {
                                                        key: 'label',
                                                        className: 'mt-2 underline float-right opacity-70 text-[10px]',
                                                },
                                                'upload'
                                        ),
                                ]
                        ),
                ]
        )
}
