import ctrl from '../index'

interface Props {
        k: any
}

export default function InputLabel(props: Props) {
        const { k } = props
        const _ = ctrl.create
        return _('div', { className: 'text-[10px] leading-[14px] mt-1' }, k)
}
