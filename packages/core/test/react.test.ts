import { ctrl, useCtrl } from '../src/react'

it('test', () => {
        expect(ctrl({})).toBeTruthy()
})

describe('react', () => {
        it('useCtrl({})', () => {
                const { a } = useCtrl({ a: 1 })
                a
        })
        it('useCtrl(c)', () => {
                const c = ctrl({ a: 1 })
                const { a } = useCtrl(c)
                a
        })
})
