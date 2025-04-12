import { ctrl } from '@tsei/ctrl/src/react'
import Example from './Example'
import Controll from './Controll'
import Installation from './Install'
import NumberCase from './Number'
import VectorCase from './Vector'
import StringCase from './String'
import BooleanCase from './Boolean'
import ColorCase from './Color'
import ButtonCase from './Button'
import SelectCase from './Select'
import ImageCase from './Image'
import PluginCase from './Plugin'
import NestedCase from './Nested'
import AudioCase from './Audio'
import VideoCase from './Video'
import FilesCase from './Files'

export const CASES = [
        Installation,
        Example,
        Controll,
        NumberCase,
        VectorCase,
        StringCase,
        BooleanCase,
        ColorCase,
        ButtonCase,
        SelectCase,
        AudioCase,
        ImageCase,
        VideoCase,
        FilesCase,
        NestedCase,
        PluginCase,
]

export default function Cases() {
        const _ = ctrl.create
        return _(
                'div',
                {
                        className: 'flex flex-col gap-4 max-w-[1024px]', //
                },
                ...CASES.map((Case, key) => _(Case, { key }))
        )
}
