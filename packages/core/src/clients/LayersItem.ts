import { Ctrl, ctrl, Target } from '../index'

interface Props<T extends Target> {
        c: Ctrl<T>
}

export default function LayersItem<T extends Target>(props: Props<T>) {
        const { c } = props

        const click = () => {
                const el = document.getElementById(c.id)
                if (!el) return
                el.scrollIntoView({ behavior: 'smooth' })
        }

        const ref = (el: HTMLDivElement | null) => {
                if (!el) return
                el.addEventListener('click', click)
        }

        const _ = ctrl.create
        const paths = c.id.split('.')
        const child = Array(paths.length).join('    ') + paths.pop()

        return _(
                'div',
                {
                        ref,
                        className: 'flex items-center h-8 cursor-pointer whitespace-pre', //
                },
                child
        )
}
