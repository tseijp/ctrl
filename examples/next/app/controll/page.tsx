'use client'

import '@tsei/ctrl/style'
import { Controller, useCtrl } from '@tsei/ctrl/src/react'

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

export default App
