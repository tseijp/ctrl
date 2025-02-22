import { append, create, ctrl, Props, remove } from '../index'

const selectRef = (button: HTMLButtonElement) => {
        return (select: HTMLDivElement | null) => {
                if (!select) return
                const rect = button.getBoundingClientRect()
                let x = rect.left
                let y = rect.top
                x -= 216
                x += rect.width
                y += rect.height
                select.style.top = `${y}px`
                select.style.left = `${x}px`
        }
}

interface DropdownProps extends Props<'button'> {
        items?: string[]
        onClick?: (item: string) => void
}

const handleClick = (props: DropdownProps) => (e: Event) => {
        const button = e.currentTarget as HTMLButtonElement

        const { items = [], onClick } = props

        const _ = create

        const children = items.map((item, index) => {
                const click = () => onClick?.(item)
                return _(
                        'div',
                        {
                                key: index + '',
                                className: 'px-6 py-1 text-white text-[12px] leading-[16px] hover:bg-[#0B8CE9] rounded-sm cursor-pointer',
                                ref: (el) => {
                                        if (!el) return
                                        el.addEventListener('click', click)
                                },
                        },
                        item
                )
        })

        const handleRemove = () => {
                remove(element, document.body)
        }

        const overlayRef = (overlay: HTMLDivElement | null) => {
                if (!overlay) return
                overlay.addEventListener('click', handleRemove)
        }

        const element = _(
                'div',
                {
                        ref: overlayRef, //
                        className: 'fixed w-screen h-screen z-[9999]',
                },
                _(
                        'div',
                        {
                                ref: selectRef(button),
                                className: `absolute w-[216px] p-2 flex flex-col border border-[#292929] rounded-xl bg-[#1e1e1e]`,
                        },
                        children
                )
        )

        append(element, document.body)
}

export default function Dropdown(props: DropdownProps) {
        const { items, onClick, ...other } = props
        const _ = ctrl.create

        const ref = (button: HTMLButtonElement | null) => {
                if (!button) return
                button.addEventListener('click', handleClick(props))
        }

        return _('button', { ref, ...other })
}
