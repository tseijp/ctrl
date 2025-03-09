import { defineConfig } from 'tsup'
import { defaultConfig } from '../../tsup.config'

export default defineConfig((options) => {
        return defaultConfig(
                {
                        entry: [
                                'src/index.ts',
                                'src/react.ts',
                                'src/solid.ts',
                                'src/vue3.ts',
                        ],
                },
                options
        )
})
