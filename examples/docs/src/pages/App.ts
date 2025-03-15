import { ctrl, Controller, sync, save, type Ctrl } from '@tsei/ctrl/src/index'
import Cases from '../cases'

export function Navigation() {
        const _ = ctrl.create
        return _(
                'ul',
                {
                        className: 'flex flex-col gap-4 py-4', //
                },
                [
                        _(
                                'li',
                                {
                                        key: '0',
                                },
                                _(
                                        'a',
                                        {
                                                href: '/',
                                        },
                                        'Basic Demo'
                                )
                        ),
                        _(
                                'ul',
                                {
                                        key: '1',
                                        className: 'flex flex-col gap-4 pl-4 text-[11px]', //
                                },
                                [
                                        _(
                                                'li',
                                                {
                                                        key: '0',
                                                },
                                                _(
                                                        'a',
                                                        {
                                                                href: '/example',
                                                        },
                                                        'Example'
                                                )
                                        ),
                                        _(
                                                'li',
                                                {
                                                        key: '1',
                                                },
                                                _(
                                                        'a',
                                                        {
                                                                href: '/controll',
                                                        },
                                                        'Controll'
                                                )
                                        ),
                                        _(
                                                'li',
                                                {
                                                        key: '2',
                                                },
                                                _(
                                                        'a',
                                                        {
                                                                href: '/headers',
                                                        },
                                                        'Headers'
                                                )
                                        ),
                                ]
                        ),
                        _(
                                'li',
                                {
                                        key: '2',
                                },
                                _(
                                        'a',
                                        {
                                                href: 'https://www.npmjs.com/package/@tsei/ctrl',
                                                target: '_blank',
                                                rel: 'noopener noreferrer',
                                        },
                                        'NPM @tsei/ctrl'
                                )
                        ),
                        _(
                                'li',
                                {
                                        key: '3',
                                },
                                _(
                                        'a',
                                        {
                                                href: 'https://github.com/tseijp/ctrl',
                                                target: '_blank',
                                                rel: 'noopener noreferrer',
                                        },
                                        'Github @tsei/ctrl'
                                )
                        ),
                        _(
                                'li',
                                {
                                        key: '4',
                                },
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
                                {
                                        key: '5',
                                },
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
                ]
        )
}

export default function App() {
        const root = document.getElementById('root')!

        const _ = ctrl.create
        const left = _(Navigation)

        const synced = sync({} as any)
        const saved = save({} as any)

        const appId = import.meta.env.PUBLIC_SKYWAY_APP_ID
        const secret = import.meta.env.PUBLIC_SKYWAY_SECRET

        synced.config = { appId, secret }
        synced.sub()
        saved.sub()

        ctrl.mounts.add((ctrled: Ctrl) => {
                type T = typeof ctrled.current
                type K = keyof T & string
                type F = (k: K, v: T[K]) => void
                const format = (f: F): F => {
                        return (k, t) => f(`${ctrled.id}.${k}`, t)
                }

                const parse = (f: F): F => {
                        return (k, t) => f(k.replace(`${ctrled.id}.`, ''), t)
                }

                ctrled.events.add(format(synced.run))
                ctrled.events.add(format(saved.run))
                saved.events.add(parse(ctrled.run))
                saved.events.add(parse((k, v) => (ctrled.current[k] = v)))
                saved.events.add(ctrled.act)
                saved.events.add(synced.run)
                synced.events.add(parse(ctrled.run))
                synced.events.add(parse((k, v) => (ctrled.current[k] = v)))
                synced.events.add(ctrled.act)
                synced.events.add(saved.run)
        })

        ctrl.append(_(Controller, { left }, _(Cases)), root)
}
