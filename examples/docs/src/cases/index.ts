import { ctrl } from '@tsei/ctrl/src/react'
import Installation from '../cases/Install'
import QuickStart from '../cases/QuickStart'
import RenderUI from '../cases/RenderUI'
import NumberCase from '../cases/Number'
import VectorCase from '../cases/Vector'
import StringCase from '../cases/String'
import BooleanCase from '../cases/Boolean'
import ColorCase from '../cases/Color'
import ButtonCase from '../cases/Button'
import SelectCase from '../cases/Select'
import ImageCase from '../cases/Image'
import PluginCase from '../cases/Plugin'
import NestedCase from './Nested'

export const CASES = [
        Installation,
        QuickStart,
        RenderUI,
        NumberCase,
        VectorCase,
        StringCase,
        BooleanCase,
        ColorCase,
        ButtonCase,
        SelectCase,
        ImageCase,
        // PluginCase,
        NestedCase,
]

export default function Cases() {
        const _ = ctrl.create

        return _(
                'div',
                {
                        className: 'flex flex-col gap-4 max-w-[1024px]', //
                },
                CASES.map((Case, key) => _(Case, { key }))
        )
}
