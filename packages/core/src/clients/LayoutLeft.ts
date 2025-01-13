import { create as _ } from '../index'

export default function LayoutLeft({ list, q }: any) {
        return _('aside', { className: 'left-0' }, [
                _(
                        'div',
                        {
                                key: 'top',
                                className: 'flex border-1 h-10 border-y-1 border-y border-goshawk-grey',
                        },
                        [
                                _(
                                        'button',
                                        {
                                                key: 'search',
                                                className: 'px-2.5 ml-1.5',
                                        },
                                        _('img', {
                                                src: 'https://r.tsei.jp/ctrl/find.svg',
                                                alt: '🔍',
                                                width: 16,
                                                height: 16,
                                        })
                                ),
                                _('input', {
                                        key: 'input',
                                        placeholder: 'Find...',
                                }),
                        ]
                ),
                _('ul', { key: 'list', className: 'px-4 text-sm' }),
        ])
}
