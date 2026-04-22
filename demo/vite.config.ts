import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";
import { BUILD_DIR } from "./src/config/deploy.config";
import { resolve } from "path";

const ENABLE_ALIASES = true;
const USE_PACKAGE_BUILDS = false;

function generateAliases() {
	if (!ENABLE_ALIASES) return {};
	const entryFile = USE_PACKAGE_BUILDS ? "dist/main.js" : "src/main.ts";

	const localPackages = [
		{ name: "auralis-os", path: resolve(__dirname, "../packages/auralis-os/" + entryFile) },
		{ name: "@auralis-os/velis", path: resolve(__dirname, "../packages/velis/" + entryFile) },
	];

	const localApps = [
		"app-center",
		"browser",
		"calculator",
		"file-explorer",
		"media-viewer",
		"settings",
		"terminal",
		"text-editor",
	];

	localApps.forEach((id) => {
		const name = `@auralis-os/${id}`;
		const path = resolve(__dirname, `../packages/apps/${id}/${entryFile}`);
		localPackages.push({ name, path });
	});

	return localPackages.reduce((aliases, localPackage) => {
		aliases[localPackage.name] = localPackage.path;
		return aliases;
	}, {} as Record<string, string>);
}

export default defineConfig(({ command }) => {
	const devMode = command == "serve";
	const aliases = generateAliases();

	return {
		base: "/",
		plugins: [
			react(),
			checker({
				typescript: true,
			}),
		],
		build: {
			outDir: BUILD_DIR,
			rollupOptions: {
				external: ["vite", "path", /vite-plugin-/g, /@vitejs\/plugin-/g, "rollup"],
				plugins: [
					
				],
				output: {
					assetFileNames: "assets/[name][extname]",
					chunkFileNames: "chunks/[name]-[hash].js",
					entryFileNames: "[name].js",
				},
			},
		},
		resolve: {
			alias: devMode ? aliases : {},
		},
		server: {
			port: 3000,
		},
		preview: {
			port: 8080,
		},
		optimizeDeps: {
			exclude: devMode ? Object.keys(aliases) : [],
		},
	} as UserConfig;
});