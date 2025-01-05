import { dragEvent } from '../helpers/drag'
import e, { append, merge } from '../helpers/node'

export default function Container() {
        const el = e(
                'div',
                {
                        className: 'fixed bg-[#2c2c2c] w-[240px] pl-4 pr-2 pb-3 text-[12px] text-white',
                },
                e('div', { className: 'leading-[40px] font-medium' }, 'Layout')
        )

        dragEvent((drag) => {
                const { offset } = drag
                const [x, y] = offset
                merge(el, { style: { transform: `translate(${x}, ${y})` } })
        }).onMount(el)

        append(document.body, el)

        return el
}
