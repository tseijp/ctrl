'use client'

import { Controller } from '@tsei/ctrl/src/react'
import { CASES } from '../../../docs/src/cases'

export default function CasesPage() {
        return (
                <Controller>
                        <div className="flex flex-col gap-4 max-w-[1024px]">
                                {CASES.map((Case: any, index) => (
                                        <Case key={index} />
                                ))}
                        </div>
                </Controller>
        )
}
