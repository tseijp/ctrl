import { ctrl, merge } from '../index'
import Bounding from './Bounding'
import ControlLeft from './ControlLeft'
import ControlNav from './ControlNav'
import ControlRight from './ControlRight'
import Expanding from './Expanding'
import Wheeling from './Wheeling'

interface Props {
        left?: any
        plugin?: any
        layers?: any
        children?: any
        disabled?: boolean
}

export default function Controller(props: Props) {
        const { children, left, plugin, layers, disabled, ...other } = props
        if (disabled) return children

        const _ = ctrl.create
        return _(
                'div',
                {
                        className: '_ctrl-wrap w-full h-screen',
                        ...other,
                },
                _(ControlNav, { key: 'nav' }),
                _(ControlLeft, { key: 'left', layers }, left),
                _(Bounding, { key: 'main' }, _(Expanding, {}, _(Wheeling, { children }))),
                _(ControlRight, { key: 'right' }, plugin)
        )
}
