import { create as _ } from '../index'

export default function LayoutLeft({ list, q }: any) {
        return _('aside', { className: 'left-0' }, [
                _(
                        'div',
                        {
                                className: 'flex border-1 h-10 border-y-1 border-y border-goshawk-grey',
                        },
                        [
                                _(
                                        'button',
                                        { className: 'px-2.5 ml-1.5' },
                                        _('img', {
                                                src: '/icons/find.svg',
                                                alt: '🔍',
                                                width: 16,
                                                height: 16,
                                        })
                                ),
                                _('input', { placeholder: 'Find...' }),
                        ]
                ),
                _(
                        'ul',
                        { className: 'px-4 text-sm' },
                        list.map((item: any) => {
                                const isActive = `${item.id}` === q
                                const style = isActive ? {} : { opacity: 0.5 }
                                const href = isActive ? '/' : `?q=${item.id}`

                                return _(
                                        'li',
                                        {
                                                key: item.id,
                                                className: 'mt-4',
                                                style,
                                        },
                                        _(
                                                'a',
                                                {
                                                        href,
                                                        className: 'flex flex-col',
                                                },
                                                [
                                                        _(
                                                                'span',
                                                                {
                                                                        className: 'text-xs',
                                                                },
                                                                formatTim_(
                                                                        item.created_at
                                                                )
                                                        ),
                                                        _(
                                                                'span',
                                                                {
                                                                        className: 'font-bold',
                                                                },
                                                                item.title
                                                        ),
                                                ]
                                        )
                                )
                        })
                ),
        ])
}
