// import adapter from "@sveltejs/adapter-auto"; // only if we're not hosting on Vercel
import adapter from "@sveltejs/adapter-vercel"; // hosted on Vercel
import preprocess from "svelte-preprocess";
import tailwind from "tailwindcss";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: "nodejs18.x" // runtime environment on hosting platform
		}),
		alias: {
			"$api": "./src/lib/integrations/index",
			"$prismic": "./ext/prismic",
			"$css": "./src/code/css",
			"$js": "./src/code/js",
		},
		prerender: {
			crawl: true,
			entries: []
		}
	},
	preprocess: [
		preprocess({
			postcss: {
				plugins: tailwind
			},
			scss: {},
			preserve: ["ld+json"]
		})
	]
};

export default config;
