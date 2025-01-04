export interface Config {
  [key: string]:
    | boolean
    | string
    | number
    | number[]
    | [x: number, y: number]
    | [x: number, y: number, z: number];
}
