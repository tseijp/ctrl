// @ts-ignore
import { createSignal, onCleanup, onMount } from 'solid-js'
import ctrl, { Ctrl, isC, Target } from './index'

export * from './index'
export default useCtrl
export { useCtrl }

function useCtrl<T extends Target>(config: T | Ctrl<T>, id?: string) {
        const c = isC(config) ? config : ctrl<T>(config as T, id)
        const [state, set] = createSignal(c.current)

        onMount(() => {
                const update = () => set(() => ({ ...c.current }))
                onCleanup(c.sub(update))
        })

        return new Proxy({} as T, {
                get(_, prop: string) {
                        return state()[prop]
                },
        })
}
