'use client'

import { useCtrl } from '@tsei/ctrl/src/react'

export default function () {
        const { hello } = useCtrl({ hello: 'world' })
        return <div>{hello}</div>
}
