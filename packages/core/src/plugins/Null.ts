import InputLabel from '../clients/InputLabel'
import { Attach, ctrl, Target } from '../index'

type Arg = null

export default function Null<T extends Target>(props: Attach<Arg, T>) {
        const { c, k, children = 'null' } = props

        const _ = ctrl.create

        return _(
                'fieldset',
                {
                        id: `${c.id}.${k}`,
                },
                [
                        _(InputLabel, { key: 'key', k }),
                        _(
                                'div',
                                {
                                        key: 'null', //
                                        className: 'font-normal opacity-20',
                                },
                                children
                        ),
                ]
        )
}
