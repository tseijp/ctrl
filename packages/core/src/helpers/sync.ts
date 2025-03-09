'use client'

import { Callback } from '../types'
import { flush } from './utils'
import type { Joined } from './webrtc'

type PublishData<
        T extends object,
        K extends keyof T & string = keyof T & string
> = [key: K, value: T[K]]

export function sync<T extends object = object>(target: T, id?: string) {
        type K = keyof T & string

        const writes = new Set<Callback<T>>()
        const events = new Set<Callback<T>>()
        const actors = new Set<Function>()
        const mounts = new Set<Function>()
        const cleans = new Set<Function>()

        let mounted = 0
        let updated = 0
        let joined: Joined

        const mount = async () => {
                if (mounted++) return
                const { join } = await import('./webrtc')
                joined = await join(set as any) // @TODO FIX
                flush(mounts)
        }

        const clean = () => {
                if (--mounted) return
                flush(cleans)
                // if (!--mounted) joined.room.close();
        }

        const sub = (fn = (_k: K, _v: T[K]) => {}) => {
                actors.add(fn)
                mount()
                return () => {
                        actors.delete(fn)
                        clean()
                }
        }

        const act = (k: K, a: T[K]) => {
                updated++
                flush(actors, k, a)
        }

        const run = (k: K, a: T[K]) => {
                joined?.data?.write([k, a])
                flush(writes, k, a)
        }

        const set = async (data: PublishData<T, K>) => {
                const [k, a] = data
                target[k] = a
                act(k, a)
                flush(events, k, a)
        }

        return {
                events,
                writes,
                actors,
                mounts,
                cleans,
                mount,
                clean,
                sub,
                act,
                run,
                set,
                get() {
                        return updated
                },
                get joined() {
                        return joined
                },
                get current() {
                        return target
                },
                isC: true,
        }
}

export type Sync = ReturnType<typeof sync>
