import ctrl from '@tsei/ctrl/src/index'
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
import Noise from '../cases/Noise'
import PluginCase from '../cases/Plugin'

export default function Cases() {
        const _ = ctrl.create

        return _(
                'div',
                {
                        className: 'flex flex-col gap-4', //
                },
                [
                        _(Installation),
                        _(QuickStart),
                        _(RenderUI),
                        _(NumberCase),
                        _(VectorCase),
                        _(StringCase),
                        _(BooleanCase),
                        _(ColorCase),
                        _(ButtonCase),
                        _(SelectCase),
                        _(ImageCase),
                        _(PluginCase),
                        _(Noise),
                ]
        )
}
