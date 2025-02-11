/**
 * utils
 * https://github.com/emotion-js/emotion/blob/cce67ec6b2fc94261028b4f4778aae8c3d6c5fd6/packages/primitives-core/src/css.ts#L131-L157
 */
const propertyValuePattern = /\s*([^\s]+)\s*:\s*(.+?)\s*$/

export const css2js = (str = '') => {
        if (str.trim() === '') return
        const ret = {}
        for (const style of str.split(';')) {
                let match = propertyValuePattern.exec(style)
                if (match === null || match[2] === ' ') continue
                // @ts-ignore
                ret[match[1]] = match[2]
        }
        return ret
}

export const js2css = <T>(obj: T) => {
        let ret = ''
        for (const key in obj) ret += `${key}:${obj[key]};`
        return ret
}

const pixelvaluePattern = /^(-?\d*\.?\d+)([a-zA-Z%]*)$/

export const str2px = (value: string): [number, string] | null => {
        const match = value.match(pixelvaluePattern)
        if (!match) return null
        return [parseFloat(match[1]), match[2]]
}
