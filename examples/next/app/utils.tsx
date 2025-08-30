import { useThree } from '@react-three/fiber'
import type { EditorView } from '@codemirror/view'
import { useLayoutEffect, useState } from 'react'
import { ctrl, Ctrl, save, sync } from '@tsei/ctrl/src/index'

/**
 * ref: https://github.com/pmndrs/react-three-fiber/issues/1394
 */
export function IgnoreScale() {
        const state = useThree()
        const [setSize] = useState(() => state.setSize)
        useLayoutEffect(() => {
                state.set({ setSize: () => null })
                return () => state.set({ setSize })
        }, [setSize])
        return null
}

export const codemirror = (element: HTMLElement, code: () => string) => {
        let view: EditorView
        ;(async () => {
                const [{ EditorView }, { javascript }, { githubLight }] = await Promise.all([
                        import('@codemirror/view'),
                        import('@codemirror/lang-javascript'),
                        import('@uiw/codemirror-theme-github'),
                ])
                view = new EditorView({
                        doc: code(),
                        parent: element,
                        extensions: [
                                githubLight,
                                javascript({ jsx: true }),
                                EditorView.editable.of(false),
                                EditorView.theme({
                                        '&': { backgroundColor: 'transparent' },
                                        '.cm-content': { padding: '0' },
                                        '.cm-gutters': { display: 'none' },
                                }),
                        ],
                })
        })()

        return () => {
                view.dispatch({
                        changes: {
                                from: 0,
                                to: view.state.doc.length,
                                insert: code(),
                        },
                })
        }
}

export const scrollTo = (id = '') => {
        const click = () => {
                const el = document.getElementById(id)
                if (!el) return
                el.scrollIntoView({ behavior: 'smooth' })
        }
        return (el: HTMLElement | null) => {
                if (!el) return
                el.addEventListener('click', click)
        }
}

let inited = false

export const initialize = () => {
        if (inited) return
        inited = true
        const synced = sync({} as any)
        const saved = save({} as any)

        const appId = process.env.NEXT_PUBLIC_SKYWAY_APP_ID
        const secret = process.env.NEXT_PUBLIC_SKYWAY_SECRET

        synced.config = { appId, secret }
        synced.sub()
        saved.sub()

        ctrl(
                {
                        DROP_DATABASE: {
                                onclick: () => {
                                        saved.idb.drop()
                                        alert('DATABASE WAS DROPED')
                                },
                        },
                },
                'DROP DATABASE'
        ).sub()

        ctrl.mounts.add((ctrled: Ctrl) => {
                type T = typeof ctrled.current
                type K = keyof T & string
                type F = (k: K, v: T[K]) => void
                const format = (f: F): F => {
                        return (k, t) => f(`${ctrled.id}.${k}`, t)
                }

                const parse = (f: F): F => {
                        return (k, t) => f(k.replace(`${ctrled.id}.`, ''), t)
                }

                ctrled.events.add(format(synced.run))
                // ctrled.events.add(format(saved.run))
                // saved.events.add(parse(ctrled.run))
                // saved.events.add(parse((k, v) => (ctrled.current[k] = v)))
                // saved.events.add(ctrled.act)
                // saved.events.add(synced.run)
                synced.events.add(parse(ctrled.run))
                synced.events.add(parse((k, v) => (ctrled.current[k] = v)))
                synced.events.add(ctrled.act)
                // synced.events.add(saved.run)
        })
}
