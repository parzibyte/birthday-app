import { defineConfig } from 'vite';

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			input: {
				index: "index.html",
				register: "register.html",
				details: "details.html",
			}
		},
	},
	server: {
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
	},
	optimizeDeps: {
		exclude: ['@sqlite.org/sqlite-wasm'],
	},
});