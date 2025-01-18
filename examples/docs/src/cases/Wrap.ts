import ctrl from '@tsei/ctrl/src/index'
import type { HTMLTag, Component } from '@tsei/ctrl/src/index'

interface Props<T extends HTMLTag> {
        Demo: Component<T>
}

const Wrap = <T extends HTMLTag>(props: Props<T>) => {
        const { Demo } = props
        const _ = ctrl.create
        return _(
                'div',
                {
                        className: 'grid w-full h-full grid-cols-[390px_1920px] gap-20',
                },
                [
                        _(Demo, {
                                className: 'w-[390px] h-[844px]',
                        }),
                        _(Demo, {
                                className: 'w-[1920px] h-[1280px]',
                        }),
                ]
        )
}

export default Wrap
