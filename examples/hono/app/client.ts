import { createClient } from 'honox/client'

createClient({
        hydrate: async (elem, root) => {
                const { hydrateRoot } = await import('react-dom/client')
                hydrateRoot(root, elem as any)
        }, // @ts-ignore
        createElement: async (type: any, props: any) => {
                const { createElement } = await import('react')
                return createElement(type, props)
        },
})
