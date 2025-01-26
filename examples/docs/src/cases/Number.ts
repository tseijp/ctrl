import { ctrl, type Props } from '@tsei/ctrl/src/index'

const code = /* TS */ `
console.log('HELLO WORLD')
`

export default function NumberCase(props: Props<'pre'>) {
        const _ = ctrl.create
        return _(
                'pre',
                props,
                _('code', { className: 'language-javascript' }, code)
        )
}
