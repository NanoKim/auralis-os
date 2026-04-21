import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import cssInjectedByJs from "vite-plugin-css-injected-by-js";

export default defineConfig({
	plugins: [
		react(),
		cssInjectedByJs(),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			formats: ["es"],
		},
		rollupOptions: {
			external: ["react", "react/jsx-runtime", /@auralis-os/g],
			output: {
				assetFileNames: "assets/[name][extname]",
				chunkFileNames: "chunks/[name]-[hash].js",
				entryFileNames: "[name].js",
			},
		},
		sourcemap: true,
	},
});