export type Merge<T extends object> = Partial<{
        [K in keyof T]: T[K] extends object ? Merge<T[K]> : T[K]
}>

export function merge<T extends object>(a: Merge<T>, b: Merge<T>) {
        for (const key in b) {
                if (is.obj(a[key]) && is.obj(b[key])) merge(a[key], b[key])
                else a[key] = b[key]
        }
}

export const is = {
        arr: Array.isArray,
        bol: (a: unknown): a is boolean => typeof a === 'boolean',
        str: (a: unknown): a is string => typeof a === 'string',
        num: (a: unknown): a is number => typeof a === 'number',
        fun: (a: unknown): a is Function => typeof a === 'function',
        und: (a: unknown): a is undefined => typeof a === 'undefined',
        nul: (a: unknown): a is null => a === null,
        set: (a: unknown): a is Set<unknown> => a instanceof Set,
        map: (a: unknown): a is Map<unknown, unknown> => a instanceof Map,
        obj: (a: unknown): a is object =>
                !!a && a.constructor.name === 'Object',
}

/**
 * each
 */
type EachFn<Value, Key, This> = (this: This, value: Value, key: Key) => void
type Eachable<Value = any, Key = any, This = any> = {
        forEach(cb: EachFn<Value, Key, This>, ctx?: This): void
}

export const each = <Value, Key, This>(
        obj: Eachable<Value, Key, This>,
        fn: EachFn<Value, Key, This>
) => obj.forEach(fn)

export const flush = <Value extends Function, Key, This>(
        obj: Eachable<Value, Key, This>,
        ...args: any[]
) => {
        each(obj, (f) => f(...args))
}

/**
 * CALCULATE VECTOR
 * REF: https://github.com/toji/gl-matrix/blob/master/src/vec2.js
 */
const Vec = typeof Float32Array !== 'undefined' ? Float32Array : Array

export const vec2 = (x = 0, y = 0, out = new Vec(2)): Vec2 => {
        out[0] = x
        out[1] = y
        return out as Vec2
}

export type Vec2 = [x: number, y: number]

export const addV = (a: Vec2, b: Vec2, out = vec2()): Vec2 => {
        out[0] = a[0] + b[0]
        out[1] = a[1] + b[1]
        return out
}

export const subV = (a: Vec2, b: Vec2, out = vec2()): Vec2 => {
        out[0] = a[0] - b[0]
        out[1] = a[1] - b[1]
        return out
}

export const cpV = (a: Vec2, out = vec2()): Vec2 => {
        out[0] = a[0]
        out[1] = a[1]
        return out
}
