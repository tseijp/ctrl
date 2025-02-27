import { ctrl } from '../index'

interface Props {
        id: string
        title: string
}

export default function LayersItem(props: Props) {
        const { id, title } = props

        const click = () => {
                const el = document.getElementById(id)
                if (!el) return
                el.scrollIntoView({ behavior: 'smooth' })
        }

        const ref = (el: HTMLDivElement | null) => {
                if (!el) return
                el.addEventListener('click', click)
        }

        const _ = ctrl.create
        const paths = title.split('.')
        const child = Array(paths.length).join('    ') + paths.pop()!

        return _(
                'div',
                {
                        ref,
                        className: 'flex items-center h-8 cursor-pointer whitespace-pre', //
                },
                child
        )
}
