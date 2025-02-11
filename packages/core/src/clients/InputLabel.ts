import ctrl from '../index'

interface Props {
        k: any
}

export default function InputLabel(props: Props) {
        const { k } = props
        const _ = ctrl.create
        return _(
                'legend',
                {
                        className: 'h-6 opacity-70 grid items-center',
                },
                _(
                        'span',
                        {
                                className: 'text-[9px] leading-[11px] font-medium',
                        },
                        k
                )
        )
}
