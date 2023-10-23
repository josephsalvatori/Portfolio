/**
 * Currently unused, but could be the endpoint for API based login to return OAuth codes
 */
import { error, json } from "@sveltejs/kit";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x"
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, locals, request, url }) {

	let req = await request.json();
	let requestObj = {
		data: {},
		errors: []
	};

	return json(requestObj);
};