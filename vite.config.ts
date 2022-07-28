import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const config = defineConfig(async () => {
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
    server: {
      fs: {
        strict: false
      }
    }
  };
});

export default config;
