import ctrl, { Ctrl, is, isU } from '../index'
import { Config } from '../types'
import Bool from './Bool'
import Char from './Char'
import Float from './Float'
import Vector from './Vector'

export default function attach<T extends Config, K extends keyof T>(
        c: Ctrl<T>,
        k: K
) {
        const _ = ctrl.create
        let a = c.current[k]
        if (isU<T[K]>(a)) a = a.value
        if (is.bol(a)) return _(Bool<T>, { key: k, k, a, c })
        if (is.str(a)) return _(Char<T>, { key: k, k, a, c })
        if (is.num(a)) return _(Float<T>, { key: k, k, a, c })
        if (is.arr(a)) return _(Vector<T>, { key: k, k, a, c })
}
