'use client'

import { ctrl } from '@tsei/ctrl/src/index'
import { Controller } from '@tsei/ctrl/src/react'

const ref = () => ctrl(document.head, 'head').sub()

export default function HeadersPage() {
        return <Controller ref={ref} />
}
