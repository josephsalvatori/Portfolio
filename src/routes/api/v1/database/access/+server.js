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

	let req = await request.json();
	let returnObj = {
		errors: []
	};

	if(!req.key) {

		let error = {
			error: "key",
			message: "Access key is required"
		};

		returnObj.errors.push(error);

		return json(returnObj);
	}

	const db = DB.db("Portfolio");

	let checkKey = await db.collection("AccessKeys").findOne({
		"key": req.key
	});

	console.log(checkKey);

	if(checkKey) returnObj.data = checkKey;

	return json(returnObj);
};