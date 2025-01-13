import { create as _ } from '../index'
import Bounding from './Bounding'
import LayoutLeft from './LayoutLeft'
import LayoutNav from './LayoutNav'
import LayoutRight from './LayoutRight'
import Wheelable from './Wheelable'

// const Main = ({ q }: any) =>
//         _(
//                 'main',
//                 {},
//                 _(
//                         Bounding,
//                         null,
//                         // @TODO FIX
//                         // _(Wheelable, {}, q ? _(Demo, { msgId: q }) : null)
//                         'Bounding'
//                 )
//         )

// const App = ({ list, q, target, basicSetting, advancedSetting }: any) => {
//         return _('div', {}, [
//                 _(Nav),
//                 _(LeftAside, { list, q }),
//                 _(Main, { q }),
//                 _(RightAside, { q, target, basicSetting, advancedSetting }),
//         ])
// }

export default function Controller() {
        return _('div', {}, [
                _(LayoutNav, { key: 'nav' }),
                _(LayoutLeft, { key: 'left' }),
                _(
                        'main',
                        { key: 'main' },
                        _(
                                Bounding,
                                {},
                                _(Wheelable, {
                                        children: [
                                                _('ul', { key: 'ul' }, [
                                                        _(
                                                                'li',
                                                                { key: '1' },
                                                                '1'
                                                        ),
                                                        _(
                                                                'li',
                                                                { key: '2' },
                                                                '2'
                                                        ),
                                                        _(
                                                                'li',
                                                                { key: '3' },
                                                                '3'
                                                        ),
                                                ]),
                                        ],
                                })
                        )
                ),
                _(LayoutRight, { key: 'right' }),
        ])
}
