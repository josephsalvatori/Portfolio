import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import DB from "$lib/integrations/mongodb/client";
import { decrypt, encrypt } from "$js/_helpers/encryption";
import { uuid } from "$js/_helpers/uuid";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x"
};

/**
 * getToken
 * @param {*} url
 * @returns
 */
const getToken = async (url) => {

	let now = new Date();
	let date = now.toISOString();
	let string = uuid(); // random auth id
	let token = await encrypt(string);

	if(typeof token === "object") token.uuid = string;
	if(typeof token === "object") token.created = date;

	return token;
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ clientAddress, cookies, locals, request, url }) {

	let req = await request.json();
	let returnObj = {
		errors: []
	};

	/** --- Default type --- */
	if(!req.type) req.type = "";

	const db = DB.db("Portfolio");

	switch(req.type) {

		case "auth":

			try {

				// RETURN?
				if(!req.token) {

				}

				let expires = new Date();

				expires.setDate(expires.getDate() + 30);

				/**
				 * Log user in, remove hash & created timestamp
				 */

				// TODO: Add hash in lookup?
				let loginUser = await db.collection("Users").findOneAndUpdate({
					"auth_token": req.token
				}, {
					$set: {
						auth: {
							token_expires: expires,
							last_access_ip: locals.clientIp || null
						},
						logged_in: true,
						updated_at: new Date(),
						status: "verified"
					}
				}, {
					includeResultMetadata: true
				});

				if(loginUser.ok && loginUser.value) {

					cookies.set("cat", req.token, {
						path: "/",
						domain: url.hostname,
						expires: expires,
						httpOnly: true
					});

					cookies.set("uid", loginUser.value.uid, {
						path: "/",
						domain: url.hostname,
						expires: expires,
						httpOnly: true
					});

					locals.cat = req.token;
					locals.user = loginUser.value;
					locals.userid = loginUser.value.uid;

					returnObj.data = loginUser.value;
				}

			} catch(error) {

				returnObj.errors.push(error);
			}

			break;

		case "auth_create":

			try {

				/**
				 * Request auth create
				 * @param {string} req.id  customer id
				 */
				if(!req.id) {

				}

				/** Check "last_auth" */
				if(req.last_auth) {
					// TODO: AUDIT THIS
					// token refresh?
					// return? check ip? update expiration?
				}

				/** Generate new auth token */
				let auth = await getToken();
				let updateObj = {
					auth_token: auth.uuid,
					auth: {
						token_created: new Date(auth.created),
						token_expires: new Date(auth.expires),
						last_access_location: auth.hash,
						last_access_ip: locals.clientIp || null
					},
					updated_at: new Date()
				};

				/**
				 * Update / Create Auth
				 */
				let upsertAuth = await db.collection("Users").findOneAndUpdate({
					"_id": new ObjectId(req.id)
				}, {
					$set: updateObj
				}, {
					includeResultMetadata: true
				});

				if(upsertAuth.ok) returnObj.data = auth.hash;

			} catch(error) {

				returnObj.errors.push(error);
			}

			break;

		case "auth_lookup":

			/** --- Get by Auth ID --- */
			try {

				if(!req.token) {

					returnObj.errors.push({
						name: "token",
						message: "User token is required."
					});

					break;
				}

				let requestObj = {
					auth_token: req.token
				};

				let user = await db.collection("Users").findOne(requestObj);

				returnObj.data = user;

			} catch(error) {

				returnObj.errors.push(error);
			}

			break;

		case "auth_remove":

			/** --- Log a user out --- */
			try {

				if(!req.id || !req.token) {

					returnObj.errors.push({
						name: "logout",
						message: "Something went wrong, refresh and try again."
					});

					break;
				}

				let authRemove = await db.collection("Users").findOneAndUpdate({
					"uid": req.id,
					"auth_token": req.token
				}, {
					$set: {
						auth: {
							last_access_ip: locals.clientIp
						},
						auth_token: null,
						logged_in: false,
						updated_at: new Date()
					}
				});

			} catch(error) {

				returnObj.errors.push(error);
			}

			break;

		case "email":

			try {

				let pipeline = [
					{
						$match: {
							email: req.email
						}
					}
				];

				let users = await db.collection("Users").aggregate(pipeline).toArray();
				let user = users.find((u) => u.email === req.email);

				if(!user) {

					returnObj.errors.push({
						name: "email",
						message: "User does not have an account."
					});

					break;
				}

				returnObj.data = user;

			} catch(error) {

				returnObj.errors.push(error);
			}

			break;

		default:

			break;
	}

	return json(returnObj);
};