import { ctrl } from '../index'
import { dragEvent } from '../helpers/drag'

interface Props {
        children?: any
        title?: string
}

export default function Container(props: Props) {
        const { children, title = 'default', ...other } = props
        const _ = ctrl.create
        const sizeClasses = 'max-w-[240px] pl-4 pr-2 pb-3 text-[12px] z-100'
        const baseClasses = '_ctrl-container text-white bg-[#2c2c2c] rounded'
        const borderClasses = 'border-1 border-t border-[rgb(68,68,68)]'

        const drag = dragEvent((drag) => {
                if (ctrl.pluginParent) return
                const { active, offset } = drag
                const [x, y] = offset
                const target = drag.target as HTMLDivElement
                const transform = `translate(${x}px, ${y}px)`
                target.style.transform = transform

                if (drag.isDragging) {
                        document.body.style.cursor = 'grabbing'
                }

                if (drag.isDragEnd) {
                        document.body.style.cursor = 'grab'
                        // reset cursor if not grab mode
                        setTimeout(() => {
                                document.body.style.cursor = ''
                        }, 200)
                } else if (!active) {
                        // grab cursor if hovered
                        document.body.style.cursor = 'grab'
                }
        })

        return _(
                'div',
                {
                        ref: drag.ref,
                        className: `${baseClasses} ${sizeClasses} ${borderClasses}`,
                        ...other,
                },
                [
                        _(
                                'div',
                                {
                                        key: '0', //
                                        className: 'h-10 grid items-center',
                                },
                                _(
                                        'div',
                                        {
                                                className: 'font-[11px] leading-[16px] font-bold',
                                        },
                                        title.split('.').pop()
                                )
                        ),
                        _(
                                'div', //
                                {
                                        key: '1', //
                                },
                                children
                        ),
                ]
        )
}
