export type Uniform<T> = { value: T }

export type Value<T> = Uniform<T> | T

export type Input =
        | Value<boolean>
        | Value<string>
        | Value<number>
        | Value<number[]>
        | Value<{ x: number }>
        | Value<[x: number, y: number]>
        | Value<[x: number, y: number, z: number]>
        | Value<{ x: number; y: number }>
        | Value<{ x: number; y: number; z: number }>

export interface Config {
        [key: string]: Input
}
