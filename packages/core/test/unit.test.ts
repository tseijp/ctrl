import { each, is } from '../src/helpers/utils'
import ctrl from '../src/index'

it('test', () => {
        expect(ctrl({})).toBeTruthy()
})

describe('helpers', () => {
        it('is', () => {
                expect(is.arr([])).toBeTruthy()
                expect(is.bol(true)).toBeTruthy()
                expect(is.str('')).toBeTruthy()
                expect(is.num(1)).toBeTruthy()
                expect(is.fun(() => {})).toBeTruthy()
                expect(is.und(undefined)).toBeTruthy()
                expect(is.nul(null)).toBeTruthy()
                expect(is.obj({})).toBeTruthy()
                expect(is.set(new Set())).toBeTruthy()
                expect(is.map(new Map())).toBeTruthy()
        })
        it('each', () => {
                const arr = [1, 2, 3]
                const fun = jest.fn()
                each(arr, fun)
                expect(fun).toHaveBeenCalledTimes(3)
        })
})
