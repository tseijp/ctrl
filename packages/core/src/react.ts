'use client'

import { useMemo } from 'react'
import ctrl from './index'
import { Config } from './types'

export function useCtrl<T extends Config>(config: T) {
        const ctrl = useMemo(() => ctrl<T>(config), [])
        // return useSyncExternalStore(ctrl.sub, ctrl.get, ctrl.get)
}

export function App() {}
