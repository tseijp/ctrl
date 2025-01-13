export type Value<T> = T | { [K in string]: K extends 'value' ? T : any }

export type Input =
        | boolean
        | string
        | number
        | number[]
        | [x: number, y: number]
        | [x: number, y: number, z: number]

export interface Config {
        [key: string]: Input
}
