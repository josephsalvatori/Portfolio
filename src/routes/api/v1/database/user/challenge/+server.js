import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import DB from "$lib/integrations/mongodb/client";
import { uuid } from "$js/_helpers/uuid";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x"
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, locals, request }) {

	let returnObj = {
		errors: []
	};

	// generate challenge

	return json(returnObj);
};