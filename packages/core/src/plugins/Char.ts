import InputLabel from '../clients/InputLabel'
import { Attach, ctrl, Target } from '../index'

type Arg = string

function isTextArea(a: unknown): a is HTMLTextAreaElement {
        return a instanceof HTMLTextAreaElement
}

function updateHeight(el: HTMLTextAreaElement) {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
}

export default function Char<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props

        const input = (e: Event) => {
                if (!isTextArea(e.target)) return
                updateHeight(e.target)
                const { value } = e.target
                c.set(k, value as T[K])
        }

        const dblclick = async (e: Event) => {
                if (!isTextArea(e.target)) return
                const { value } = e.target
                try {
                        await navigator.clipboard.writeText(value)
                        alert('Text copied to clipboard!')
                } catch (err) {
                        alert('Failed to copy text')
                }
        }
        let clean = () => {}

        const ref = (el: HTMLTextAreaElement) => {
                if (!el) return
                el.addEventListener('input', input)
                el.addEventListener('dblclick', dblclick)
                el.defaultValue = a

                setTimeout(() => updateHeight(el))

                const update = (key: K, arg: Arg) => {
                        if (key !== k) return
                        el.value = arg
                }

                const clean = () => {
                        c.updates.delete(update)
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
                        _(InputLabel, { key: 'key', k }),
                        _('textarea', {
                                ref,
                                key: 'textarea',
                                rows: 1,
                                className: '_ctrl-input _hidden-scrollbar bg-[#383838] rounded-sm px-2 py-1 leading-[20px] w-full block max-h-[50vh]',
                                defaultValue: a,
                        }),
                ]
        )
}
