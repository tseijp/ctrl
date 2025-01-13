import { create as _ } from '../index'

export default function LayoutRight({
        q,
        target,
        basicSetting,
        advancedSetting,
}: any) {
        return _('aside', { className: 'right-0' }, [
                _(
                        'div',
                        {
                                className: 'h-10 border-1 border-y border-goshawk-grey',
                        },
                        _(
                                'span',
                                { className: 'mx-4 leading-10 font-bold' },
                                q ? 'Update' : 'New Creation'
                        )
                ),
                _(
                        'h3',
                        { className: 'mx-4 mt-4 font-bold text-xs' },
                        'Basic Setting'
                ),
                _(
                        'form',
                        {
                                key: q,
                                className: 'px-4',
                                action: basicSetting.bind(null, q),
                        },
                        [
                                _('label', {}, [
                                        _('span', {}, 'title'),
                                        _('textarea', {
                                                required: true,
                                                name: 'title',
                                                className: 'peer/title',
                                                placeholder: 'input here...',
                                                defaultValue: target?.title,
                                        }),
                                ]),
                                _('label', {}, [
                                        _('span', {}, 'content'),
                                        _('textarea', {
                                                required: true,
                                                name: 'content',
                                                className: 'peer/content',
                                                placeholder: 'input here...',
                                                defaultValue: target?.content,
                                        }),
                                ]),
                                _('label', {}, [
                                        _('span', {}, 'created by'),
                                        _('input', {
                                                name: 'created_by',
                                                placeholder: 'input here...',
                                                defaultValue:
                                                        target?.created_by,
                                        }),
                                ]),
                                _(
                                        'div',
                                        { className: 'py-4' },
                                        _(
                                                'button',
                                                {
                                                        className: 'bg-out-of-the-blue px-2 py-0.5 rounded-sm',
                                                },
                                                _(
                                                        'span',
                                                        {
                                                                className: 'text-sm',
                                                        },
                                                        'Save'
                                                )
                                        )
                                ),
                        ]
                ),
        ])
}

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
