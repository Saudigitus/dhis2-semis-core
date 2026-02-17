import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'dhis2-semis-components': resolve(__dirname, 'src/libs/components/src'),
      'dhis2-semis-types': resolve(__dirname, 'src/libs/types/src'),
      'dhis2-semis-functions': resolve(__dirname, 'src/libs/functions/src'),

      'dhis2-semis-enrollment': resolve(
        __dirname,
        'src/modules/enrollment/src'
      ),
      'dhis2-semis-performance': resolve(
        __dirname,
        'src/modules/performance/src'
      ),

      '@libs': resolve(__dirname, 'src/libs'),
      '@modules': resolve(__dirname, 'src/modules')
    }
  }
})
