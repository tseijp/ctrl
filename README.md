# @tsei/ctrl

<div align="center">

@tsei/ctrl is Open Source figma like cms controller

### [🌐 Website ▶︎](https://ctrl.tsei.jp)&emsp;|&emsp;[💬 Discussion forum ▶︎](https://github.com/tseijp/ctrl/discussions)&emsp;|&emsp;[😎 Showcase submission ▶︎](https://github.com/tseijp/ctrl/discussions/7)

</div>

### Installation

```rb
npm i @tsei/ctrl
```

### Quick Start

###### Basics

```tsx
import { useCtrl } from '@tsei/ctrl/react'

function MyComponent() {
        const { hello } = useCtrl({ hello: 'world' })
        return <div>{hello}</div>
}
```

###### ESM Support

```html
<div id="root">world</div>
<script type="module">
        import { ctrl } from 'https://esm.sh/@tsei/ctrl@0.11.0/es2022'
        const c = ctrl({ hello: 'world' })
        const root = document.getElementById('root')

        c.sub(() => {
                root.innerText = c.current.hello
        })
</script>
```

### Render UI

###### Basics

```tsx
import { Controller, useCtrl } from '@tsei/ctrl/react'
import '@tsei/ctrl/style'

function MyComponent() {
        const { a, b, c } = useCtrl({ a: 0, b: 0, c: 0 })
        return (
                <Controller>
                        <ul>
                                <li>{a}</li>
                                <li>{b}</li>
                                <li>{c}</li>
                        </ul>
                </Controller>
        )
}
```

###### ESM Support

```html
<link rel="stylesheet" href="https://esm.sh/@tsei/ctrl@0.11.0/dist/index.css" />
<script type="module">
        import {
                Controller,
                ctrl,
        } from 'https://esm.sh/@tsei/ctrl@0.11.0/es2022'
        const c = ctrl({ a: 0, b: 0, c: 0 })
        const _ = ctrl.create

        ctrl.render(
                _(
                        Controller,
                        {},
                        _('ul', {}, [
                                _('li', { id: 'a' }, '0'),
                                _('li', { id: 'b' }, '0'),
                                _('li', { id: 'c' }, '0'),
                        ])
                ),
                document.body
        )

        c.sub((key) => {
                document.getElementById(key).innerText = c.current[key]
        })
</script>
```

### Input Types

###### Number

```ts
const c = ctrl({
        number0: 0 // or
        number1: { value: 1 },
})
```

###### Vector

```ts
const c = ctrl({
        vector0: [0, 0, 0], // or
        vector1: { x: 1, y: 1, z: 1 }, // or
        vector2: { value: [0, 0, 0] }, // or
        vector3: { value: { x: 1, y: 1, z: 1 } },
})
```

###### String

```ts
const c = ctrl({
        string0: 'HELLO', // or
        string1: { value: 'WORLD' },
})
```

###### Boolean

```ts
const c = ctrl({
        boolean0: true // or
        boolean1: { value: false },
})
```

###### Color

```ts
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
```

###### Button

```ts
const c = ctrl({
        button0: { onclick: () => console.log('CLICKED') }, // or
        button1: document.querySelector('button'), // or
        button2: { value: { onclick: () => console.log('CLICKED') } }, // or
        button3: { value: document.querySelector('button') },
})
```

###### Select

```ts
const c = ctrl({
        select0: { options: ['#f00', '#0f0', '#00f'] }, // or
        select1: { options: document.querySelectorAll('option') }, // or
        select2: document.querySelector('select'), // or
        select3: { value: { options: ['#f00', '#0f0', '#00f'] } }, // or
        select4: { value: { options: document.querySelectorAll('option') } }, // or
        select5: { value: document.querySelector('select') },
})
```

###### Image

```ts
const c = ctrl({
        image0: { src: 'https://r.tsei.jp/block.png' }, // or
        image1: document.querySelector('img'), // or
        image2: { value: { src: 'https://r.tsei.jp/block.png' } }, // or
        image3: { value: document.querySelector('img') },
})
```

### Update value

###### Manuary Update

```tsx
const c = ctrl({ hello: 'world' })

const reset = () => {
        c.set('hello', 'world')
}

function App() {
        const { hello } = useCtrl(c)
        return <button onClick={reset}>{hello}</button>
}
```

###### Listen Change

```tsx
const c = ctrl({ hello: 'world' })

const update = () => console.log(c.current.hello)

c.listeners.add(update)

function App() {
        const { hello } = useCtrl(c)
        return <button>{hello}</button>
}
```

### Recipies

###### DevTool

```tsx
const c = ctrl<HTMLDivElement>(null!)

function App() {
        return <div ref={c.ref}></div>
}
```

###### r3f DevTool

```tsx
const c = ctrl<THREE.MeshBasicMaterial>(null!)

function Box() {
        return (
                <mesh ref={c.ref}>
                        <boxGeometry />
                        <meshBasicMaterial />
                </mesh>
        )
}
```

###### HTMLElement

```ts
ctrl(document.body).sub()
```

###### Uniforms

```tsx
const uniforms = { uResolution: { value: [1280, 800] } }
const mat = THREE.MeshBasicMaterial({ uniforms })

ctrl(mat.uniforms).sub()
```
