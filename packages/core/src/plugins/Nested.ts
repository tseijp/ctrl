import { ctrl, PluginItem } from '../index'
import { Attach, Target } from '../types'

export default function Nested<T extends Target>(props: Attach<unknown, T>) {
        const { a, c, k } = props
        const child = ctrl(a, `${c.id}.${k}`)
        const _ = ctrl.create

        // register
        child.parent = c as any // @TODO FIX
        c.mounts.add(child.mount)
        c.cleans.add(child.clean)

        return _(PluginItem, { c: child })
}
