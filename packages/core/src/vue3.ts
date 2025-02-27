// @ts-ignore
import { h, customRef, onMounted, onUnmounted } from 'vue'
import { append, create, Ctrl, ctrl, isC, register, Target } from './index'
import _Controller from './clients/Controller'

export * from './index'
export default useCtrl
export { useCtrl }

function useCtrl<T extends Target>(c: Ctrl<T>, id?: string): T

function useCtrl<T extends Target>(config: T, id?: string): T

function useCtrl<T extends Target>(config: T | Ctrl<T>, id?: string): T {
        return customRef((track = () => {}, trigger = () => {}) => {
                const c = isC(config) ? config : ctrl(config, id)
                onMounted(() => onUnmounted(c.sub(trigger)))
                return {
                        get() {
                                track()
                                return c.current
                        },
                }
        })
}

/**
 * Controller
const updated = ref(0)

const Plugins = {
        name: 'Plugins',
        setup() {
                watchEffect(() => updated.value)
                return () => {
                        return [...store].map((c) =>
                                h(PluginItem, { c, key: c.id })
                        )
                }
        },
}

const Layers = {
        name: 'Layers',
        setup() {
                watchEffect(() => updated.value)
                return () => {
                        return [...store].map((c) =>
                                h(LayersItem, { c, key: c.id })
                        )
                }
        },
}

let isInitialized = false

function initialize() {
        if (isInitialized) return
        isInitialized = true
        register({ mount, create: h })
}

export const Controller = (...args: any[]) => {
        initialize()
        console.log(args)
        try {
                return h(_Controller, ...args)
        } catch (e) {}
}
 */

const ref = (el: HTMLDivElement) => {
        el.append(create(_Controller))
}

export const Controller = (props: any, ...other: any[]) => {
        return h('div', { ...props, ref }, ...other)
}
