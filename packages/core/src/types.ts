import { ext, is } from './helpers/utils'

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
        if ('r' in a) if ('g' in a) if ('b' in a) return true
        return false
}

export interface SelectOptions {
        options: string[]
}

export const isSelect = (a: unknown): a is SelectOptions => {
        if (!is.obj(a)) return false
        if ('options' in a) if (is.arr(a.options)) return true
        return false
}

/**
 * Button
 */
export interface ButtonOnClick {
        onclick: () => void
}

export const isButton = (a: unknown): a is ButtonOnClick => {
        if (!is.obj(a)) return false
        if ('onclick' in a) if (is.fun(a.onclick)) return true
        return false
}

/**
 * Audio, Image, Video
 */

// prettier-ignore
const AUDIO_EXT = new Set(['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'ape', 'midi', 'mid'])
// prettier-ignore
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif', 'avif', 'apng', 'heic', 'heif'])
// prettier-ignore
const VIDEO_EXT = new Set(['mp4', 'webm', 'ogv', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'm4v', '3gp', '3g2'])

export interface FilesSource {
        src: string
        name?: string
        size?: number
        type?: string
}

export const isFiles = (a: unknown): a is FilesSource => {
        if (!is.obj(a)) return false
        if ('src' in a) return is.str(a.src)
        return false
}

export interface AudioSource extends FilesSource {}

export const isAudio = (a: unknown): a is AudioSource => {
        if (isFiles(a)) return AUDIO_EXT.has(ext(a.src))
        return false
}

export interface ImageSource extends FilesSource {
        alt?: string
}

export const isImage = (a: unknown): a is ImageSource => {
        if (isFiles(a)) return IMAGE_EXT.has(ext(a.src))
        return false
}

export interface VideoSource extends FilesSource {
        alt?: string
}

export const isVideo = (a: unknown): a is AudioSource => {
        if (isFiles(a)) return VIDEO_EXT.has(ext(a.src))
        return false
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
        | Value<[x: number, y: number, z: number, w: number]>
        | Value<XYZVector>
        | Value<RGBColor>

export interface Target {
        [key: string]: Input | Target | any
}

export type Callback<T extends Target = Target> = (
        key: keyof T & string,
        arg: T[keyof T & string]
) => void

export interface Ctrl<T extends Target = Target> {
        isC: true
        get parent(): null | Ctrl
        set parent(parent: Ctrl)
        get id(): string
        set id(id: string)
        get current(): T
        writes: Set<Callback<T>>
        events: Set<Callback<T>>
        actors: Set<Function>
        mounts: Set<Function>
        cleans: Set<Function>
        mount(): void
        clean(): void
        sub(fn?: () => void): () => void
        get(): number
        act: Callback<T>
        set: Callback<T>
        run: Callback<T>
        ref(target: T | null): void
        cache: any
}

export const isC = <T extends Target>(a: unknown): a is Ctrl<T> => {
        if (!is.obj(a)) return false
        if ('isC' in a) return true
        return false
}

export interface Attach<
        Arg,
        T extends Target = Target,
        K extends keyof T & string = keyof T & string
> {
        children?: string
        a: Arg & T[K]
        c: Ctrl<T>
        k: K
}

export interface CustomPlugin<Arg = unknown> {
        is(a: unknown): a is Arg
        el(props: Attach<Arg>): any
}
