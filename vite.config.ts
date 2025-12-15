import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'dhis2-semis-components': path.resolve(
        __dirname,
        'src/libs/components/src'
      ),
      'dhis2-semis-functions': path.resolve(
        __dirname,
        'src/libs/functions/src'
      ),
      'dhis2-semis-types': path.resolve(
        __dirname,
        'src/libs/types/src'
      ),
    },
  },
})
