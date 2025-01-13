import { create as _ } from '../index'
import Bounding from './Bounding'
import ControlLeft from './ControlLeft'
import ControlNav from './ControlNav'
import ControlRight from './ControlRight'
import Wheelable from './Wheelable'

interface Props {
        children: any
}

export default function Controller(props: Props) {
        const { children } = props
        return _('div', {}, [
                _(ControlNav, { key: 'nav' }),
                _(ControlLeft, { key: 'left' }),
                _(
                        'main',
                        {
                                key: 'main', //
                                className: '_ctrl-main',
                        },
                        _(Bounding, {}, _(Wheelable, { children }))
                ),
                _(ControlRight, { key: 'right' }),
        ])
}
