// upload csv processing endpoint, moves to cloudfront file store
import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import DB from "$lib/integrations/mongodb/client";
import { decrypt, encrypt } from "$js/_helpers/encryption";
import { uuid } from "$js/_helpers/uuid";

/** @type {import('./$types').RequestHandler} */
export async function POST({ clientAddress, cookies, locals, request, url }) {

	/** Get form encoded data */
	let data = await request.formData();
	let returnObj = {
		errors: []
	};



	return json(returnObj);
};