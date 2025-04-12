/**
 * Tests for the utils helper functions
 */

import {
        merge,
        is,
        isServer,
        each,
        flush,
        sig,
        dig,
        fig,
        ext,
        vec2,
        addV,
        subV,
        cpV,
        fullscreen,
        replace,
        mark,
} from '../../src/helpers/utils'

describe('utils', () => {
        describe('merge', () => {
                it('should merge objects', () => {
                        const a = { a: 1, b: 2 }
                        const b = { b: 3, c: 4 }

                        merge(a, b)

                        expect(a).toEqual({ a: 1, b: 3, c: 4 })
                })

                it('should merge nested objects', () => {
                        const a = { a: 1, b: { c: 2, d: 3 } }
                        const b = { b: { c: 4, e: 5 } }

                        merge(a, b)

                        expect(a).toEqual({ a: 1, b: { c: 4, d: 3, e: 5 } })
                })

                it('should not merge arrays', () => {
                        const a = { a: [1, 2] }
                        const b = { a: [3, 4] }

                        merge(a, b)

                        expect(a).toEqual({ a: [3, 4] })
                })
        })

        describe('is', () => {
                it('should check if value is an array', () => {
                        expect(is.arr([])).toBe(true)
                        expect(is.arr({})).toBe(false)
                })

                it('should check if value is a boolean', () => {
                        expect(is.bol(true)).toBe(true)
                        expect(is.bol(false)).toBe(true)
                        expect(is.bol(0)).toBe(false)
                })

                it('should check if value is a string', () => {
                        expect(is.str('')).toBe(true)
                        expect(is.str('hello')).toBe(true)
                        expect(is.str(123)).toBe(false)
                })

                it('should check if value is a number', () => {
                        expect(is.num(0)).toBe(true)
                        expect(is.num(123)).toBe(true)
                        expect(is.num('123')).toBe(false)
                })

                it('should check if value is a function', () => {
                        expect(is.fun(() => {})).toBe(true)
                        expect(is.fun(function () {})).toBe(true)
                        expect(is.fun({})).toBe(false)
                })

                it('should check if value is undefined', () => {
                        expect(is.und(undefined)).toBe(true)
                        expect(is.und(null)).toBe(false)
                        expect(is.und(0)).toBe(false)
                })

                it('should check if value is null', () => {
                        expect(is.nul(null)).toBe(true)
                        expect(is.nul(undefined)).toBe(false)
                        expect(is.nul(0)).toBe(false)
                })

                it('should check if value is an object', () => {
                        expect(is.obj({})).toBe(true)
                        expect(is.obj(Object.create(null))).toBe(true)
                        expect(is.obj([])).toBe(false)
                        expect(is.obj(null)).toBe(false)
                })

                it('should check if value is a Set', () => {
                        expect(is.set(new Set())).toBe(true)
                        expect(is.set({})).toBe(false)
                })

                it('should check if value is a Map', () => {
                        expect(is.map(new Map())).toBe(true)
                        expect(is.map({})).toBe(false)
                })

                it('should check if value is NaN', () => {
                        expect(is.nan(NaN)).toBe(true)
                        expect(is.nan(0)).toBe(false)
                        expect(is.nan('NaN')).toBe(false)
                })
        })

        describe('isServer', () => {
                const originalWindow = global.window

                afterEach(() => {
                        global.window = originalWindow
                })

                it('should return true if window is undefined', () => {
                        // @ts-ignore
                        delete global.window
                        expect(isServer()).toBe(true)
                })

                it('should return false if window is defined', () => {
                        global.window = {} as Window & typeof globalThis
                        expect(isServer()).toBe(false)
                })
        })

        describe('each', () => {
                it('should iterate over array', () => {
                        const arr = [1, 2, 3]
                        const fn = jest.fn()

                        each(arr, fn)

                        expect(fn).toHaveBeenCalledTimes(3)
                        expect(fn).toHaveBeenCalledWith(1, 0)
                        expect(fn).toHaveBeenCalledWith(2, 1)
                        expect(fn).toHaveBeenCalledWith(3, 2)
                })

                it('should iterate over Set', () => {
                        const set = new Set([1, 2, 3])
                        const fn = jest.fn()

                        each(set, fn)

                        expect(fn).toHaveBeenCalledTimes(3)
                        expect(fn).toHaveBeenCalledWith(1, 1)
                        expect(fn).toHaveBeenCalledWith(2, 2)
                        expect(fn).toHaveBeenCalledWith(3, 3)
                })

                it('should iterate over Map', () => {
                        const map = new Map([
                                ['a', 1],
                                ['b', 2],
                        ])
                        const fn = jest.fn()

                        each(map, fn)

                        expect(fn).toHaveBeenCalledTimes(2)
                        expect(fn).toHaveBeenCalledWith(1, 'a')
                        expect(fn).toHaveBeenCalledWith(2, 'b')
                })
        })

        describe('flush', () => {
                it('should call all functions in a Set', () => {
                        const set = new Set<Function>()
                        const fn1 = jest.fn()
                        const fn2 = jest.fn()

                        set.add(fn1)
                        set.add(fn2)

                        flush(set)

                        expect(fn1).toHaveBeenCalledTimes(1)
                        expect(fn2).toHaveBeenCalledTimes(1)
                })

                it('should pass arguments to functions', () => {
                        const set = new Set<Function>()
                        const fn = jest.fn()

                        set.add(fn)

                        flush(set, 'a', 1)

                        expect(fn).toHaveBeenCalledWith('a', 1)
                })
        })

        describe('sig', () => {
                it('should round to specified significant digits', () => {
                        expect(sig(1.2345, -2)).toBe(1.23)
                        expect(sig(1.2345, -1)).toBe(1.2)
                        expect(sig(1.2345, 0)).toBe(1)
                })

                it('should handle negative numbers', () => {
                        expect(sig(-1.2345, -2)).toBe(-1.23)
                        expect(sig(-1.2345, -1)).toBe(-1.2)
                        expect(sig(-1.2345, 0)).toBe(-1)
                })

                it('should use default values', () => {
                        expect(sig()).toBe(0)
                        expect(sig(1.2345)).toBe(1.23)
                })
        })

        describe('dig', () => {
                it('should return number of digits in integer part', () => {
                        expect(dig(0)).toBe(1)
                        expect(dig(1)).toBe(1)
                        expect(dig(10)).toBe(2)
                        expect(dig(100)).toBe(3)
                })

                it('should handle negative numbers', () => {
                        expect(dig(-1)).toBe(0)
                        expect(dig(-10)).toBe(1)
                        expect(dig(-100)).toBe(2)
                })

                it('should handle decimal numbers', () => {
                        expect(dig(1.23)).toBe(1)
                        expect(dig(12.34)).toBe(2)
                })

                it('should use default value', () => {
                        expect(dig()).toBe(1)
                })
        })

        describe('fig', () => {
                it('should return number of digits in decimal part', () => {
                        expect(fig(0)).toBe(0)
                        expect(fig(1)).toBe(0)
                        expect(fig(1.2)).toBe(1)
                        expect(fig(1.23)).toBe(2)
                })

                it('should handle negative numbers', () => {
                        expect(fig(-1.2)).toBe(1)
                        expect(fig(-1.23)).toBe(2)
                })

                it('should use default value', () => {
                        expect(fig()).toBe(0)
                })
        })

        describe('ext', () => {
                it('should extract file extension', () => {
                        expect(ext('file.txt')).toBe('txt')
                        expect(ext('file.jpg')).toBe('jpg')
                        expect(ext('file.tar.gz')).toBe('gz')
                })

                it('should handle paths', () => {
                        expect(ext('/path/to/file.txt')).toBe('txt')
                        expect(ext('C:\\path\\to\\file.jpg')).toBe('jpg')
                })

                it('should handle URLs', () => {
                        expect(ext('https://example.com/file.txt')).toBe('txt')
                        expect(
                                ext('https://example.com/file.txt?query=1')
                        ).toBe('txt')
                })

                it('should handle files without extension', () => {
                        expect(ext('file')).toBe('')
                })

                it('should use default value', () => {
                        expect(ext()).toBe('pdf')
                })
        })

        describe('vector operations', () => {
                describe('vec2', () => {
                        it('should create a 2D vector', () => {
                                const v = vec2(1, 2)
                                expect(v[0]).toBe(1)
                                expect(v[1]).toBe(2)
                        })

                        it('should use default values', () => {
                                const v = vec2()
                                expect(v[0]).toBe(0)
                                expect(v[1]).toBe(0)
                        })

                        it('should use output vector if provided', () => {
                                const out = [0, 0] as [number, number]
                                const v = vec2(1, 2, out)

                                expect(v).toBe(out)
                                expect(v[0]).toBe(1)
                                expect(v[1]).toBe(2)
                        })
                })

                describe('addV', () => {
                        it('should add two vectors', () => {
                                const a = [1, 2] as [number, number]
                                const b = [3, 4] as [number, number]
                                const result = addV(a, b)

                                expect(result[0]).toBe(4)
                                expect(result[1]).toBe(6)
                        })

                        it('should use output vector if provided', () => {
                                const a = [1, 2] as [number, number]
                                const b = [3, 4] as [number, number]
                                const out = [0, 0] as [number, number]
                                const result = addV(a, b, out)

                                expect(result).toBe(out)
                                expect(result[0]).toBe(4)
                                expect(result[1]).toBe(6)
                        })
                })

                describe('subV', () => {
                        it('should subtract two vectors', () => {
                                const a = [3, 4] as [number, number]
                                const b = [1, 2] as [number, number]
                                const result = subV(a, b)

                                expect(result[0]).toBe(2)
                                expect(result[1]).toBe(2)
                        })

                        it('should use output vector if provided', () => {
                                const a = [3, 4] as [number, number]
                                const b = [1, 2] as [number, number]
                                const out = [0, 0] as [number, number]
                                const result = subV(a, b, out)

                                expect(result).toBe(out)
                                expect(result[0]).toBe(2)
                                expect(result[1]).toBe(2)
                        })
                })

                describe('cpV', () => {
                        it('should copy a vector', () => {
                                const a = [1, 2] as [number, number]
                                const result = cpV(a)

                                expect(result).not.toBe(a)
                                expect(result[0]).toBe(1)
                                expect(result[1]).toBe(2)
                        })

                        it('should use output vector if provided', () => {
                                const a = [1, 2] as [number, number]
                                const out = [0, 0] as [number, number]
                                const result = cpV(a, out)

                                expect(result).toBe(out)
                                expect(result[0]).toBe(1)
                                expect(result[1]).toBe(2)
                        })
                })
        })

        describe('fullscreen', () => {
                const mockRequestFullscreen = jest.fn()
                const mockExitFullscreen = jest.fn()

                beforeEach(() => {
                        // Mock document fullscreen methods
                        Object.defineProperty(document, 'fullscreenElement', {
                                value: null,
                                writable: true,
                        })
                        document.exitFullscreen = mockExitFullscreen

                        // Mock element fullscreen method
                        Element.prototype.requestFullscreen =
                                mockRequestFullscreen
                })

                afterEach(() => {
                        jest.clearAllMocks()
                })

                it('should request fullscreen if not in fullscreen mode', () => {
                        const element = document.createElement('div')
                        fullscreen(element)

                        expect(mockRequestFullscreen).toHaveBeenCalled()
                        expect(mockExitFullscreen).not.toHaveBeenCalled()
                })

                it('should exit fullscreen if already in fullscreen mode', () => {
                        const element = document.createElement('div')
                        // @ts-ignore
                        document.fullscreenElement = element

                        fullscreen(element)

                        expect(mockRequestFullscreen).not.toHaveBeenCalled()
                        expect(mockExitFullscreen).toHaveBeenCalled()
                })
        })

        describe('replace', () => {
                it('should replace all occurrences of a character', () => {
                        expect(replace('a_b_c')).toBe('a/b/c')
                        expect(replace('a-b-c', '-', '/')).toBe('a/b/c')
                })

                it('should use default values', () => {
                        expect(replace()).toBe('')
                })
        })

        describe('mark', () => {
                const mockGetElementById = jest.fn().mockImplementation(() => ({
                        style: {},
                }))

                beforeEach(() => {
                        document.getElementById = mockGetElementById
                })

                afterEach(() => {
                        jest.clearAllMocks()
                })

                it('should set color of element with given id', () => {
                        const element = { style: {} as CSSStyleDeclaration }
                        mockGetElementById.mockReturnValueOnce(element)

                        mark('test-id')

                        expect(mockGetElementById).toHaveBeenCalledWith(
                                'test-id'
                        )
                        expect(element.style.color).toBe('#F0B72E')
                })

                it('should do nothing if element not found', () => {
                        mockGetElementById.mockReturnValueOnce(null)

                        mark('test-id')

                        expect(mockGetElementById).toHaveBeenCalledWith(
                                'test-id'
                        )
                })
        })
})
