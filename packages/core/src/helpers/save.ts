import { Callback } from '../types'
import { flush, mark } from './utils'

const promised = (req: any) => {
        return new Promise((resolve, reject) => {
                req.onsuccess = (e: any) => resolve(e.target.result)
                req.onerror = (e: any) => reject(e.target.error)
        })
}

const DEFAULT_DB_NAME = 'IDB'
const DEFAULT_DB_VERSION = 1
const DEFAULT_STORE_NAME = 'store'

export const indexed = <T extends object = object>(id = DEFAULT_STORE_NAME) => {
        type K = keyof T & string
        const open = () => {
                const req = indexedDB.open(DEFAULT_DB_NAME, DEFAULT_DB_VERSION)
                req.onupgradeneeded = (e: any) => {
                        const db = e.target.result
                        if (db.objectStoreNames.contains(id)) return
                        db.createObjectStore(id, { keyPath: 'key' })
                }
                return promised(req)
        }

        const drop = () => {
                indexedDB.deleteDatabase(DEFAULT_DB_NAME)
        }

        const transact = async (mode = 'readwrite') => {
                const db = await open() // @ts-ignore
                const transaction = db.transaction([id], mode)
                return transaction.objectStore(id)
        }

        const all = async () => {
                const store = await transact('readonly')
                return promised(store.getAll())
        }

        const one = async (key: K) => {
                const store = await transact('readonly')
                const item = await promised(store.get(key))
                return (item as { value?: T[K] })?.value
        }

        const set = async (key: K, value: T[K]) => {
                const store = await transact('readwrite')
                return promised(store.put({ key, value }))
        }

        const del = async (key: K) => {
                const store = await transact('readwrite')
                return promised(store.delete(key))
        }

        return { open, drop, transact, all, one, set, del }
}

export function save<T extends object = object>(
        target: T,
        id = DEFAULT_STORE_NAME
) {
        type K = keyof T & string
        const writes = new Set<Callback<T>>()
        const events = new Set<Callback<T>>()
        const actors = new Set<Function>()
        const mounts = new Set<Function>()
        const cleans = new Set<Function>()

        let mounted = 0
        let updated = 0

        const idb = indexed<T>(id)

        const mount = async () => {
                if (mounted++) return
                for (const key in target) {
                        const k = key as unknown as K
                        const a = (await idb.one(k)) as T[K]
                        if (!a) return
                        if (a === target[key]) return
                        target[k] = a
                        console.log(k, a)
                        act()
                }
                flush(mounts)
        }

        const clean = () => {
                if (--mounted) return
                flush(cleans)
        }

        const sub = (fn = () => {}) => {
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
                idb.set(k, a)
                flush(writes, k, a)
        }

        const set = (k: K, a: T[K]) => {
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
                get current() {
                        return target
                },
                idb,
                isC: true,
        }
}

export type Save = ReturnType<typeof save>
