import { ctrl } from '../index'
import LeftLayers from './LeftLayers'
import { wheelEvent } from '../helpers/wheel'

const wheel = wheelEvent((wheel) => {
        const { event } = wheel
        const isZoom = (event as any).ctrlKey
        if (isZoom) return
        event.stopPropagation()
})

export default function ControlLeft(props: any) {
        const { children, layers } = props
        const _ = ctrl.create
        return _(
                'aside',
                {
                        key: 'left', //
                        ref: wheel.ref,
                        className: '_ctrl-aside _hidden-scrollbar left-0 relative overflow-y-hidden',
                },
                _(
                        'div',
                        {
                                key: 'top',
                                className: 'flex border-1 h-10 border-y-1 border-y border-[rgb(68,68,68)]',
                        },
                        _(
                                'button',
                                {
                                        key: 'search',
                                        className: '_ctrl-button px-2.5 ml-1.5',
                                },
                                _(
                                        'img', //
                                        {
                                                src: 'https://r.tsei.jp/ctrl/find.svg',
                                                alt: '🔍',
                                                width: 16,
                                                height: 16,
                                        }
                                )
                        ),
                        _(
                                'input', //
                                {
                                        key: 'input',
                                        className: '_ctrl-input bg-transparent text-sm',
                                        placeholder: 'Find...',
                                }
                        )
                ),
                _(
                        'div',
                        {
                                key: 'list', // @TODO
                                className: 'px-4 text-sm',
                        },
                        children
                ),
                _(
                        LeftLayers,
                        {
                                key: 'layers', //
                        },
                        layers
                )
        )
}
