import { defineConfig } from 'tsup'
import { defaultConfig } from '../../tsup.config'

export default defineConfig((options) => {
        return defaultConfig(
                {
                        entry: [
                                'src/index.ts',
                                'src/react.ts',
                                'src/plugins/css/index.ts',
                        ],
                },
                options
        )
})
