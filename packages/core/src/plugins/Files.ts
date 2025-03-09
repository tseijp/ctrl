import InputLabel from '../clients/InputLabel'
import { ext, is } from '../helpers/utils'
import ctrl from '../index'
import type { Attach, FilesSource, Target } from '../types'

const formatFileSize = (bytes?: number) => {
        if (!bytes) return ''
        const units = ['B', 'KB', 'MB', 'GB']
        let size = bytes
        let unitIndex = 0

        while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024
                unitIndex++
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`
}

const render = (el: HTMLInputElement, file: File | string) => {
        const _children = el.nextElementSibling!?.childNodes
        if (!_children) return
        let children = Array.from(_children) as HTMLDivElement[]

        if (file instanceof File) {
                const _size = formatFileSize(file.size)
                children[0].textContent = file.name || 'upload'
                children[1].textContent = `${_size} • ${file.type || ''}`
        }

        if (is.str(file)) {
                const filename = file.split('/').pop() ?? ''
                const extension = ext(filename)
                const isInit = filename.endsWith(extension)
                if (isInit) {
                        children[0].textContent = extension
                        children[1].textContent = 'upload'
                } else {
                        children[0].textContent = filename
                        children[1].textContent = extension
                }
        }
}

type Arg = FilesSource

export default function Files<T extends Target>(props: Attach<Arg, T>) {
        type K = keyof T & string
        const { a, c, k } = props
        const { src } = a as Arg

        const ref = (el: HTMLInputElement | null) => {
                if (!el) return c.cache[k]?.()

                const change = (e: Event) => {
                        const el = e.target
                        if (!(el instanceof HTMLInputElement)) return
                        if (!el.files || el.files.length === 0) return
                        const file = el.files[0]
                        a.src = URL.createObjectURL(file)
                        a.name = file.name
                        a.size = file.size
                        a.type = file.type
                        c.set(k, a)
                        render(el, file)
                }

                setTimeout(() => render(el, src)) // children is not rendered yet
                el.addEventListener('change', change)

                const run = (key: K, arg: Arg) => {
                        if (key !== k) return
                        render(el, arg.src)
                }

                c.writes.add(run)
                c.cache[k] = () => {
                        c.writes.delete(run)
                        el.removeEventListener('change', change)
                }
        }

        const _ = ctrl.create

        const children = [
                _('div', { key: '0' }),
                _('div', { key: '1', className: 'underline' }),
        ]

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
                                        className: '_ctrl-input flex items-center rounded-sm px-2 py-2 bg-[#383838] cursor-pointer',
                                },
                                [
                                        _(
                                                'input', //
                                                {
                                                        ref,
                                                        key: '0',
                                                        type: 'file',
                                                        className: 'hidden',
                                                        accept: `.${ext(src)}`,
                                                }
                                        ),
                                        _(
                                                'div',
                                                {
                                                        key: '1',
                                                        className: 'flex justify-between w-full flex-wrap text-[9px]',
                                                },
                                                children
                                        ),
                                ]
                        ),
                ]
        )
}
