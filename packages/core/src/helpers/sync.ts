'use client'

import { Callback } from '../types'
import { flush, isServer, mark } from './utils'
import { join, type Joined, type Config } from './webrtc'

type PublishData<T extends object, K extends keyof T & string = keyof T & string> = [key: K, value: T[K]]

export function sync<T extends object = object>(target: T, id = '') {
        type K = keyof T & string

        const writes = new Set<Callback<T>>()
        const events = new Set<Callback<T>>()
        const actors = new Set<Function>()
        const mounts = new Set<Function>()
        const cleans = new Set<Function>()

        let mounted = 0
        let updated = 0
        let joined: Joined
        let _config: Config

        const mount = async () => {
                if (isServer()) return
                if (mounted++) return
                // @ts-ignore
                const SKYWAY = await import('@skyway-sdk/room')
                joined = await join(SKYWAY, set as any, _config) // @TODO FIX
                flush(mounts)
        }

        const clean = () => {
                if (isServer()) return
                if (--mounted) return
                flush(cleans)
        }

        const sub = (fn = (_k: K, _v: T[K]) => {}) => {
                actors.add(fn)
                mount()
                return () => {
                        actors.delete(fn)
                        clean()
                }
        }

        const act = () => {
                updated++
                flush(actors)
        }

        const run = (k: K, a: T[K]) => {
                joined?.data?.write([k, a])
                flush(writes, k, a)
        }

        const set = async (data: PublishData<T, K>) => {
                let [k, a] = data
                target[k] = a
                mark(k)
                act()
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
                set config(config: Config) {
                        _config = config
                },
        }
}

export type Sync = ReturnType<typeof sync>
