import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { UserConfig } from 'vite';
import { fileURLToPath } from 'url';
import lodash from 'lodash';
import projectConfig from './config.js';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { sveltekit } from '@sveltejs/kit/vite';

/**
 * @see https://medium.com/@ftaioli/using-node-js-builtin-modules-with-vite-6194737c2cd2
 */
const defaultConfig: UserConfig = {
  plugins: [sveltekit()],
  /**
   * @see https://stackoverflow.com/questions/70648181/how-to-resolve-absolute-path-using-vite-and-eslint-in-svelte
   */
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      timers: 'rollup-plugin-node-polyfills/polyfills/timers'
    }
  },
  server: {
    fs: {
      strict: false
    },
    port: 3000,
    // https://vitejs.dev/config/server-options.html#server-hmr
    strictPort: true,
    hmr: {
      port: 3001
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()]
    }
  }
};

export default lodash.merge({}, defaultConfig, projectConfig.vite ?? {});
