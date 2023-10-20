import { error, json } from "@sveltejs/kit";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { ObjectId } from "mongodb";
import DB from "$lib/integrations/mongodb/client";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "edge"
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, locals, request, url }) {

	let pubKey;
	let req = await request.json();
	let requestObj = {
		data: {},
		errors: []
	};
	let userId = req.id;
	let auth = req.auth;
	let verify;

	/** Required */
	if(!userId) {

		requestObj.push({ error: "user", message: "User is required for authentication" });

		return error(403, requestObj);
	}

	/** Verify passkey */
	try {

		let challenge = Buffer.from(decodeURIComponent(cookies.get("chl")), "base64").toString("ascii");

		verify = await verifyRegistrationResponse({
			response: auth,
			requireUserVerification: true,
			expectedChallenge: challenge,
			expectedOrigin: url.origin
		});

		cookies.delete("chl");

	} catch(error) {

		console.log(error);
	}

	/** Store verified passkeys */
	if(verify.verified) {

		/** Get user from database */
		try {

			const db = DB.db("Accounts");

			let passkeyObject = {
				guid: verify.registrationInfo.aaguid,
				counter: verify.registrationInfo.counter,
				credentialID: verify.registrationInfo.credentialID,
				credentialPublicKey: verify.registrationInfo.credentialPublicKey
			};

			let updateUser = await db.collection("Users").findOneAndUpdate({
				"_id": new ObjectId(userId)
			}, {
				$addToSet: {
					passkeys: passkeyObject
				}
			}, {
				includeResultMetadata: true
			});

			requestObj.data = passkeyObject;

		} catch(error) {

			console.log(error);
		}
	}

	return json(requestObj);
};