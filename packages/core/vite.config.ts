import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import cssInjectedByJs from "vite-plugin-css-injected-by-js";

export default defineConfig({
	plugins: [
		react(),
		cssInjectedByJs(),
		dts({
			include: ["src"],
			outDir: "./dist",
			rollupTypes: true,
			strictOutput: true,
			pathsToAliases: false,
			tsconfigPath: "tsconfig.build.json",
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			formats: ["es"],
		},
		rollupOptions: {
			external: ["react", "react/jsx-runtime", /@auralis-os/],
			output: {
				assetFileNames: "assets/[name][extname]",
				chunkFileNames: "chunks/[name]-[hash].js",
				entryFileNames: "[name].js",
			},
		},
		sourcemap: true,
	},
});