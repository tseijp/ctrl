'use client'

import { Controller } from '@tsei/ctrl/src/react'
import { Navigation } from '../../docs/src/pages/App'
import { CASES } from '../../docs/src/cases'

export default function CasesPage() {
        // @ts-ignore
        const left = <Navigation />
        return (
                <Controller left={left}>
                        <div className="flex flex-col gap-4 max-w-[1024px]">
                                {CASES.map((Case: any, index) => (
                                        <Case key={index} />
                                ))}
                        </div>
                </Controller>
        )
}
