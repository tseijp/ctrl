/**
 * Test fixtures for @tsei/ctrl
 */

import { RGBColor, XYZVector } from '../../src/types'

/**
 * Basic test values for different types
 */
export const testValues = {
        // Basic types
        number: 42,
        string: 'Hello World',
        boolean: true,

        // Vectors
        vectorArray: [1, 2, 3],
        vectorObject: { x: 1, y: 2, z: 3 },

        // Colors
        colorHex: '#ff0000',
        colorRGB: { r: 1, g: 0, b: 0 },
        colorHSL: { h: 0, s: 100, l: 50 },

        // Button
        button: { onclick: () => console.log('clicked') },

        // Select
        select: { options: ['option1', 'option2', 'option3'] },

        // Media
        audio: { src: 'test.mp3' },
        image: { src: 'test.png' },
        video: { src: 'test.mp4' },

        // Nested
        nested: { a: { b: { c: 123 } } },
        nestedArray: { array: [1, 2, [3, 4]] },

        // CSS
        css: { style: 'width: 100px; height: 100px;' },
        cssObject: { style: { width: '100px', height: '100px' } },
}

/**
 * Test objects with uniform values
 */
export const testUniformValues = {
        number: { value: 42 },
        string: { value: 'Hello World' },
        boolean: { value: true },
        vectorArray: { value: [1, 2, 3] },
        vectorObject: { value: { x: 1, y: 2, z: 3 } },
        colorHex: { value: '#ff0000' },
        colorRGB: { value: { r: 1, g: 0, b: 0 } },
        colorHSL: { value: { h: 0, s: 100, l: 50 } },
        button: { value: { onclick: () => console.log('clicked') } },
        select: { value: { options: ['option1', 'option2', 'option3'] } },
        audio: { value: { src: 'test.mp3' } },
        image: { value: { src: 'test.png' } },
        video: { value: { src: 'test.mp4' } },
        nested: { value: { a: { b: { c: 123 } } } },
        nestedArray: { value: { array: [1, 2, [3, 4]] } },
        css: { value: { style: 'width: 100px; height: 100px;' } },
        cssObject: { value: { style: { width: '100px', height: '100px' } } },
}

/**
 * Test target objects for ctrl
 */
export const testTargets = {
        empty: {},

        singleValue: {
                count: 0,
        },

        multipleValues: {
                count: 0,
                text: 'Hello',
                active: true,
        },

        nestedValues: {
                user: {
                        name: 'John',
                        age: 30,
                        address: {
                                city: 'Tokyo',
                                country: 'Japan',
                        },
                },
                settings: {
                        theme: 'dark',
                        notifications: true,
                },
        },

        vectorValues: {
                position: [0, 0, 0],
                rotation: { x: 0, y: 0, z: 0 },
                scale: [1, 1, 1],
        },

        colorValues: {
                primary: '#0968DA',
                secondary: { r: 0.5, g: 0.5, b: 0.5 },
                accent: { h: 120, s: 100, l: 50 },
        },

        mixedTypes: {
                count: 0,
                position: [0, 0, 0],
                color: '#ff0000',
                active: true,
                options: { options: ['small', 'medium', 'large'] },
                reset: { onclick: () => console.log('reset') },
        },
}

/**
 * Creates a color object
 * @param r Red component (0-1)
 * @param g Green component (0-1)
 * @param b Blue component (0-1)
 * @param a Alpha component (0-1)
 * @returns RGBColor object
 */
export function createColor(
        r: number = 1,
        g: number = 0,
        b: number = 0,
        a: number = 1
): RGBColor {
        return { r, g, b, a }
}

/**
 * Creates a vector object
 * @param x X component
 * @param y Y component
 * @param z Z component
 * @param w W component
 * @returns XYZVector object
 */
export function createVector(
        x: number = 0,
        y: number = 0,
        z: number = 0,
        w?: number
): XYZVector {
        return { x, y, z, ...(w !== undefined ? { w } : {}) }
}

/**
 * Creates a button object with onclick handler
 * @param handler Click handler function
 * @returns Button object
 */
export function createButton(handler: () => void = () => {}): {
        onclick: () => void
} {
        return { onclick: handler }
}

/**
 * Creates a select object with options
 * @param options Array of option values
 * @returns Select object
 */
export function createSelect(options: string[] = []): { options: string[] } {
        return { options }
}

/**
 * Creates a media source object
 * @param src Source URL
 * @param type Media type
 * @param name File name
 * @param size File size
 * @returns Media source object
 */
export function createMediaSource(
        src: string,
        type: string = '',
        name: string = '',
        size: number = 0
): { src: string; type?: string; name?: string; size?: number } {
        return {
                src,
                ...(type ? { type } : {}),
                ...(name ? { name } : {}),
                ...(size ? { size } : {}),
        }
}
