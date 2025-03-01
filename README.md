# @tsei/ctrl

<div align="center">

[@tsei/ctrl is Open Source figma like cms controller](https://github.com/tseijp/ctrl)

###### [🌐 Website ▶︎&emsp;|&emsp;](https://ctrl.tsei.jp)[💬 Discussion forum ▶︎&emsp;|&emsp;](https://github.com/tseijp/ctrl/discussions)[😎 Showcase submission ▶︎](https://github.com/tseijp/ctrl/discussions/7)

[![ npm version ](https://img.shields.io/npm/v/@tsei/ctrl?style=flat&colorA=0968DA&colorB=0968DA)](https://www.npmjs.com/package/@tsei/ctrl)
[![ downloads ](https://img.shields.io/npm/dm/@tsei/ctrl.svg?style=flat&colorA=0968DA&colorB=0968DA)](https://www.npmtrends.com/@tsei/ctrl)
[![ license MIT ](https://img.shields.io/npm/l/@tsei/ctrl?style=flat&colorA=0968DA&colorB=0968DA)](https://github.com/tseijp/ctrl)
[![ docs available ](https://img.shields.io/badge/docs-available-0968DA.svg?style=flat&colorA=0968DA)](https://ctrl.tsei.jp/>)
[![ bundle size ](https://img.shields.io/bundlephobia/minzip/@tsei/ctrl?style=flat&colorA=0968DA&colorB=0968DA)](https://bundlephobia.com/package/@tsei/ctrl@latest)

<a href="https://ctrl.tsei.jp" target="_blank">
  <img width="640px" alt=" " src="https://github.com/user-attachments/assets/12de2025-52ec-4c22-b736-54cb3f9a3301" />
</a>

</div>

### Installation

```rb
npm i @tsei/ctrl
```

### Basic Example

###### React Support

```tsx
import { useCtrl } from '@tsei/ctrl/react'

function App() {
        const { hello } = useCtrl({ hello: 'world' })
        return <div>{hello}</div>
}
```

###### Solid Support

```ts
import { useCtrl } from '@tsei/ctrl/solid'

export default function App() {
        const c = useCtrl({ hello: 'world' })
        return <div>{c.hello}</div>
}
```

###### Vue Support

```vue
<script setup>
import '@tsei/ctrl/style'
import { useCtrl } from '@tsei/ctrl/vue3'
const c = useCtrl({ hello: 'world' })
</script>

<template>
        {{ c.hello }}
</template>
```

###### ESM Support

```html
<div id="root">world</div>
<script type="module">
        import { ctrl } from 'https://esm.sh/@tsei/ctrl@0.11.0/es2022'
        const c = ctrl({ hello: 'world' })
        c.sub(() => {
                document.getElementById('root').innerText = c.current.hello
        })
</script>
```

### Render Controller

###### React Support

```tsx
import '@tsei/ctrl/style'
import { Controller, useCtrl } from '@tsei/ctrl/react'

function App() {
        const { a, b, c } = useCtrl({ a: 0, b: 1, c: 2 })
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

###### Solid Support

```ts
import '@tsei/ctrl/style'
import { Controller, useCtrl } from '@tsei/ctrl/react'

function App() {
        const c = useCtrl({ a: 0, b: 1, c: 2 })
        return (
                <>
                        <Controller />
                        <ul>
                                <li>{c.a}</li>
                                <li>{c.b}</li>
                                <li>{c.c}</li>
                        </ul>
                </>
        )
}
```

###### Vue Support

```vue
<script setup>
import '@tsei/ctrl/style'
import { Controller, useCtrl } from '@tsei/ctrl/src/vue3'
const c = ctrl({ a: 0, b: 1, c: 2 })
</script>

<template>
        <Controller />
        <ul>
                <li>{c.a}</li>
                <li>{c.b}</li>
                <li>{c.c}</li>
        </ul>
</template>
```

###### ESM Support

```html
<link rel="stylesheet" href="https://esm.sh/@tsei/ctrl@latest/dist/index.css" />
<script type="module">
        import {
                Controller,
                ctrl,
        } from 'https://esm.sh/@tsei/ctrl@latest/es2022/index.mjs'
        const c = ctrl({ a: 0, b: 1, c: 2 })
        const _ = ctrl.create

        ctrl.append(
                _(
                        Controller,
                        {},
                        _('ul', {}, [
                                _('li', { id: 'a' }, '0'),
                                _('li', { id: 'b' }, '1'),
                                _('li', { id: 'c' }, '2'),
                        ])
                ),
                document.body
        )

        c.sub((key) => {
                document.getElementById(key).innerText = c.current[key]
        })
</script>
```

### Interface of ctrl

```ts
export interface Ctrl<
        T extends Target = Target,
        K extends keyof Target & string = keyof Target & string
> {
        get updated(): number
        get mounted(): number
        get parent(): null | Ctrl
        set parent(parent: Ctrl)
        get id(): string
        set id(id: string)
        get current(): T
        listeners: Set<Function>
        cleanups: Set<Function>
        updates: Set<Function>
        mounts: Set<Function>
        mount(): void
        clean(): void
        update(k: K, a: T[K]): void
        sub(fn?: Function): Function
        get(): number
        set(k: K, a: T[K]): void
        sync(k: K, a: T[K]): void
        ref(target: T | null): void
        isC: true
        cache: any
}
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
