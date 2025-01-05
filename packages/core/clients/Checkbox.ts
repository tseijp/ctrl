import e from '../helpers/node'

interface Props {
        x: boolean
        _x?: (x: boolean) => void
}

export default function Checkbox(props: Props) {
        const { x, _x } = props
        return e('input', {
                type: 'checkbox',
                checked: x,
                onchange: (e) => _x?.((e.target as HTMLInputElement).checked),
        })
}
