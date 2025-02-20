import { ctrl, dragEvent } from '../index'

const ref = (el: Node | null) => {
        ctrl.layersParent = el
}

export default function LeftLayers(props: any) {
        const { children } = props
        const _ = ctrl.create
        const drag = dragEvent(() => {
                const next = drag.target?.nextSibling as HTMLDivElement
                const [, my] = drag.offset
                next.style.height = `${280 - my}px`
        })

        return _(
                'div',
                {
                        className: 'absolute bottom-0 w-full bg-[rgb(44,44,44)]', //
                },
                [
                        _(
                                'div',
                                {
                                        key: 'top', //
                                        ref: drag.ref, //
                                        className: 'pl-4 flex items-center border-1 h-10 border-y-1 border-y border-[rgb(68,68,68)]',
                                },
                                _(
                                        'span',
                                        {
                                                className: 'font-bold text-[11px] select-none', //
                                        },
                                        'Layers'
                                )
                        ),
                        _(
                                'div',
                                {
                                        key: 'bottom', //
                                        ref,
                                        className: 'pl-4 text-[11px] h-[280px] min-h-[80px] max-h-[calc(100vh-208px)] overflow-scroll _hidden-scrollbar',
                                },
                                children
                        ),
                ]
        )
}
