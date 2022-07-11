import { sveltekit } from '@sveltejs/kit/vite';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * @see https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
 */
const _dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  /**
   * @see https://stackoverflow.com/questions/70648181/how-to-resolve-absolute-path-using-vite-and-eslint-in-svelte
   */
  resolve: {
    alias: {
      '~': path.resolve(_dirname, 'src')
    }
  }
};

export default config;
