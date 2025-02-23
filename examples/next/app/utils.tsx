import { useThree } from '@react-three/fiber'
import type { EditorView } from '@codemirror/view'
import { useLayoutEffect, useState } from 'react'

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
                const [{ EditorView }, { javascript }, { githubLight }] =
                        await Promise.all([
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
