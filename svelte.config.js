import adapter from '@sveltejs/adapter-auto';
// Tailwind
import { vitePreprocess } from '@sveltejs/kit/vite';

// MDSVEX
import { mdsvex } from 'mdsvex';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
  //tells Svelte what types of files to treat as components
  extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })] // tells mdsvex to look .md(by default .svx)
};

export default config;
