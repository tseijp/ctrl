import { create as e } from '../index'
import { Config } from '../types'
import Checkbox from './Checkbox'
import InputVector from './InputVector'

type CtrlSet<T extends Config> = (key: keyof T, arg: T[keyof T]) => void

export interface BoolProps<T extends Config> {
        k: keyof T & string
        arg: boolean
        set: CtrlSet<T>
}

export const Bool = <T extends Config>(props: BoolProps<T>) => {
        const { k, arg, set } = props
        return e(Checkbox, {
                x: arg,
                _x: (x) => set(k, x as T[keyof T]),
        })
}

export interface FloatProps<T extends Config> {
        k: keyof T & string
        arg: number
        set: CtrlSet<T>
}

export const Float = <T extends Config>(props: FloatProps<T>) => {
        const { k, arg, set } = props
        return e(InputVector, {
                k,
                x: arg,
                _x: (x) => set(k, x as T[keyof T]),
        })
}

export interface VectorProps<T extends Config> {
        k: keyof T & string
        arg: number[]
        set: CtrlSet<T>
}

export const Vector = <T extends Config>(props: VectorProps<T>) => {
        const { k, arg, set } = props
        const change = (_012 = 0) => {
                return (value = 0) => {
                        arg[_012] = value
                        set(k, x as T[keyof T])
                }
        }
        const [x, y, z] = arg
        const [_x, _y, _z] = [0, 1, 2].map(change)
        return e(InputVector, { x, y, z, _x, _y, _z, k })
}
