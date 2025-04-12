import { ctrl } from '../src/index'

describe('index', () => {
        it('### Number Cases', () => {
                const c = ctrl({
                        number0: 0, // or
                        number1: { value: 1 },
                })
                c.current
        })

        it('### Vector Cases', () => {
                // Vector
                const c = ctrl({
                        vector0: [0, 0, 0], // or
                        vector1: { x: 1, y: 1, z: 1 }, // or
                        vector2: { value: [0, 0, 0] }, // or
                        vector3: { value: { x: 1, y: 1, z: 1 } },
                })
                c.current
        })

        it('### String Cases', () => {
                // String
                const c = ctrl({
                        string0: 'asdf', // or
                        string1: { value: 'asdfasdf' },
                })
                c.current
        })

        it('### Boolean Cases', () => {
                // Boolean
                const c = ctrl({
                        boolean0: true, // or
                        boolean1: { value: false },
                })
                c.current
        })

        it('### Color Cases', () => {
                // Color
                const c = ctrl({
                        color0: '#fff', // or
                        color1: { r: 1, g: 1, b: 1 }, // or
                        color2: { h: 0, s: 0, l: 100 }, // or
                        color3: { Y: 1, x: 1, y: 1 }, // or
                        color4: { value: '#fff' }, // or
                        color5: { value: { r: 1, g: 1, b: 1 } }, // or
                        color6: { value: { h: 0, s: 0, l: 100 } }, // or
                        color7: { value: { Y: 1, x: 1, y: 1 } },
                })
                c.current
        })

        it('### Button Cases', () => {
                // Button
                const c = ctrl({
                        button0: { onclick: () => console.log('CLICKED') }, // or
                        button1: document.querySelector('button'), // or
                        button2: {
                                value: {
                                        onclick: () => console.log('CLICKED'),
                                },
                        }, // or
                        button3: { value: document.querySelector('button') },
                })
                c.current
        })

        it('### Select Cases', () => {
                // Select
                const c = ctrl({
                        select0: { options: ['#f00', '#0f0', '#00f'] }, // or
                        select1: {
                                options: document.querySelectorAll('option'),
                        }, // or
                        select2: document.querySelector('select'), // or
                        select3: {
                                value: { options: ['#f00', '#0f0', '#00f'] },
                        }, // or
                        select4: {
                                value: {
                                        options: document.querySelectorAll(
                                                'option'
                                        ),
                                },
                        }, // or
                        select5: { value: document.querySelector('select') },
                })
                c.current
        })

        it('### Image Cases', () => {
                // Image
                const c = ctrl({
                        image0: { src: 'https://r.tsei.jp/block.png' }, // or
                        image1: { src: 'https://r.tsei.jp/block.png' }, // or
                        image2: {
                                value: { src: 'https://r.tsei.jp/block.png' },
                        }, // or
                        image3: {
                                value: { src: 'https://r.tsei.jp/block.png' },
                        },
                })
                c.current
        })

        it('### Nested Cases', () => {
                // Nested
                const c = ctrl({
                        nested0: { a: { b: { c: 0 } } }, // or
                        nested1: { value: { a: { b: { c: 0 } } } },
                        nested2: { array: [0, 1, [2, 3]] },
                        nested3: { value: { array: [0, 1, [2, 3]] } },
                })
                c.current
        })

        it('### CSS Plugin', () => {
                // Boolean
                const c = ctrl({
                        cssPlugin0: { style: 'width:1280px; height:800px;' }, // or
                        cssPlugin1: {
                                style: { width: '1280px', height: '800px' },
                        }, // or
                        cssPlugin2: {
                                value: { style: 'width:1280px; height:800px;' },
                        }, // or
                        cssPlugin3: {
                                value: {
                                        style: {
                                                width: '1280px',
                                                height: '800px',
                                        },
                                },
                        },
                })
                c.current
        })
})
