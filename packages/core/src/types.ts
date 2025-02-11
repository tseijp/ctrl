import { Ctrl } from './index'
import { is } from './helpers/utils'

export const PARENT_ID = '_ctrl-parent'

/**
 * Vector
 */
export interface XYZVector {
        x?: number
        y?: number
        z?: number
        w?: number
}

export const isVector = (a: object): a is XYZVector => {
        if (!a) return false
        if (typeof a !== 'object') return false
        if ('x' in a) return true
        if ('y' in a) return true
        if ('z' in a) return true
        return false
}

export const isEuler = (a: object): a is XYZVector => {
        if (isVector(a)) if ('isEuler' in a) return true
        return false
}

export const isQuaternion = (a: object): a is XYZVector => {
        if (isVector(a)) if ('isQuaternion' in a) return true
        return false
}

/**
 * Matrix
 */
export interface Matrix {
        elements: number[]
}

export const isMatrix = (a: object): a is Matrix => {
        if (!a) return false
        if (typeof a !== 'object') return false
        if ('elements' in a) if (is.arr(a.elements)) return true
        return false
}

/**
 * Color
 */
export interface RGBColor {
        r?: number
        g?: number
        b?: number
        a?: number
}

export const isHex = (a: string) => {
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(a)
}

export const isColor = (a: object): a is RGBColor => {
        if (!a) return false
        if ('r' in a) return true
        if ('g' in a) return true
        if ('b' in a) return true
        return false
}

export const isSelect = (a: unknown): a is 1 => {
        if (!is.obj(a)) return false
        return true
}

/**
 * Uniform
 */
export type Uniform<T> = { value: T }

export const isU = <T>(a: unknown): a is Uniform<T> => {
        if (!is.obj(a)) return false
        if ('value' in a) return true
        return false
}

/**
 * Input
 */
export type Value<T> = Uniform<T> | T

export type Input =
        | Value<boolean>
        | Value<string>
        | Value<number>
        | Value<number[]>
        | Value<[x: number]>
        | Value<[x: number, y: number]>
        | Value<[x: number, y: number, z: number]>
        | Value<XYZVector>
        | Value<RGBColor>

export interface Target {
        [key: string]: Input | any
}

export const isC = <T extends Target>(a: unknown): a is Ctrl<T> => {
        if (!is.obj(a)) return false
        if ('isC' in a) return true
        return false
}

export interface Attach<Arg, T extends Target, K extends keyof T = keyof T> {
        children?: string
        key?: K
        a: Arg & T[K]
        c: Ctrl<T>
        k: K
}

export type Plugins<Arg> = <T extends Target>(args: Attach<Arg, T>) => any
