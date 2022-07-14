import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { parseProjectConfig } from './utils/config';

const config = defineConfig(async () => {
  // read project config
  /** @note Vanilla Vite supports JSON. Consider replacing YAML. */
  const cfg = await parseProjectConfig();

  // return user config
  return {
    plugins: [sveltekit()],
    /**
     * @see https://stackoverflow.com/questions/70648181/how-to-resolve-absolute-path-using-vite-and-eslint-in-svelte
     */
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      __PROJECT_CONFIG__: JSON.stringify(cfg),
      __PROJECT_ROOT__: `"${__dirname}"`
    },
    optimizeDeps: {
      include: ['jquery']
    }
  };
});

export default config;
