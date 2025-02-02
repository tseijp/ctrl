import Prism from 'prismjs'
import { ctrl, Controller } from '@tsei/ctrl/src/index'
import Installation from '../cases/Install'
import QuickStarted from '../cases/Quick'
import NumberCase from '../cases/Number'
import VectorCase from '../cases/Vector'
import StringCase from '../cases/String'
import BooleanCase from '../cases/Boolean'
import ColorCase from '../cases/Color'
import ButtonCase from '../cases/Button'
import SelectCase from '../cases/Select'
import ImageCase from '../cases/Image'
import Noise from '../cases/Noise'
import 'prismjs'
import 'prismjs/themes/prism.css'

export default function App() {
        const root = document.getElementById('root')!

        const _ = ctrl.create
        const ref = () => void Prism.highlightAll()
        const left = _('div', {}, [_('a', { href: '/' }, 'Getting Started')])

        ctrl.render(
                _<'div'>(
                        Controller,
                        { ref, left, className: 'flex flex-col gap-4' },
                        [
                                _(Installation),
                                _(QuickStarted),
                                _(NumberCase),
                                _(VectorCase),
                                _(StringCase),
                                _(BooleanCase),
                                _(ColorCase),
                                _(ButtonCase),
                                _(SelectCase),
                                _(ImageCase),
                                _(Noise),
                        ]
                ),
                root
        )
}
