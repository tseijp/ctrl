import { createRoute } from 'honox/factory'
import Counter from '../islands/counter'
import Controller from '../islands/controller'

export default createRoute((c) => {
        const name = c.req.query('name') ?? 'Hono'
        return c.render(
                <Controller>
                        <title>{name}</title>
                        <h1>Hello, {name}!</h1>
                        <Counter />
                </Controller>
        )
})
