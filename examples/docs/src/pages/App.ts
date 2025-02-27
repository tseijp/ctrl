import { ctrl, Controller } from '@tsei/ctrl/src/index'
import Cases from '../cases'

function Navigation() {
        const _ = ctrl.create
        return _('ul', { className: 'flex flex-col gap-4 py-4' }, [
                _(
                        'li',
                        {},
                        _(
                                'a',
                                {
                                        href: '/',
                                },
                                'Documentation'
                        )
                ),
                _(
                        'li',
                        {},
                        _(
                                'a',
                                {
                                        href: 'https://github.com/tseijp/ctrl',
                                        target: '_blank',
                                        rel: 'noopener noreferrer',
                                },
                                'Github Source Code'
                        )
                ),
                _(
                        'li',
                        {},
                        _(
                                'a',
                                {
                                        href: 'https://github.com/tseijp/ctrl/discussions',
                                        target: '_blank',
                                        rel: 'noopener noreferrer',
                                },
                                'Discussion forum'
                        )
                ),
                _(
                        'li',
                        {},
                        _(
                                'a',
                                {
                                        href: 'https://github.com/tseijp/ctrl/discussions/7',
                                        target: '_blank',
                                        rel: 'noopener noreferrer',
                                },
                                'Showcase submission'
                        )
                ),
        ])
}

export default function App() {
        const root = document.getElementById('root')!

        const _ = ctrl.create
        const left = _(Navigation)

        ctrl.append(_<'div'>(Controller, { left }, _(Cases)), root)
}
