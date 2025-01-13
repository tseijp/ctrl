import { create as _ } from '../index'

export default function LayoutRight({ q }: any) {
        return _('aside', { key: 'right', className: 'right-0' }, [
                _(
                        'div',
                        {
                                key: 'top',
                                className: 'h-10 border-1 border-y border-goshawk-grey',
                        },
                        _(
                                'span',
                                {
                                        key: 'soan',
                                        className: 'mx-4 leading-10 font-bold',
                                },
                                q ? 'Update' : 'New Creation'
                        )
                ),
                _(
                        'h3',
                        {
                                key: 'container',
                                className: 'mx-4 mt-4 font-bold text-xs',
                        },
                        'Basic Setting'
                ),
        ])
}
