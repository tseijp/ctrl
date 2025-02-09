import type { EditorView } from '@codemirror/view'

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
