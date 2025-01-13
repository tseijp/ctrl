'use client'

import { create as _ } from '../index'

interface Props {
        x: boolean
        _x?: (x: boolean) => void
}

export default function Checkbox(props: Props) {
        const { x, _x } = props
        return _('input', {
                type: 'checkbox',
                checked: x,
                onchange: (e) => _x?.((e.target as HTMLInputElement).checked),
        })
}
