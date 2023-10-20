import { fail, redirect } from "@sveltejs/kit";
import { decrypt, encrypt } from "$js/_helpers/encryption";
import { uuid } from "$js/_helpers/uuid";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

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

	let fullUrl = `${url}?k=${token.hash}`;
	if(typeof token === "object") token.url = fullUrl;
	if(typeof token === "object") token.uuid = string;
	if(typeof token === "object") token.created = date;

	return token;
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, fetch, locals, parent, params, request, url }) {

	let token = url.searchParams.get("k");
	let auth;

	if(token) auth = await decrypt(token);

	/** Unusual 'both exist' case */
	if(locals.cat && auth) {

		/** Non-match */
		if(locals.cat !== auth.token) {

			/** Remove cat */
			cookies.delete("cat", { path: "/" });

			/** Redirect to account? */
			throw redirect(302, "/account/login/");
		}

		if(locals.cat === auth.token) throw redirect(302, "/account/");
	}

	/** If logged in, get user by token */
	if(locals.cat) {

		/** Get user by Token */
		let userRequest = await fetch(`/api/v1/database/user`, {
			method: "POST",
			body: JSON.stringify({
				token: locals.cat,
				type: "auth_lookup"
			})
		});

		let userData = await userRequest.json();

		/** Check more than logged in? */
		if(userData?.data?.logged_in === true) {

			let now = new Date();
			let tokenExpires = new Date(userData?.data?.auth?.token_expires);

			if(now <= tokenExpires) {

				locals.user = userData.data;

				throw redirect(302, "/account/");
			}
		}
	}

	/** Check token */
	if(auth?.expired === true) {
		throw redirect(302, "/account/login/");
	}

	/** Token is valid, log user in */
	if(auth?.token) {

		let updateRequest = await fetch(`/api/v1/database/user`, {
			method: "POST",
			body: JSON.stringify({
				token: auth.token,
				type: "auth"
			})
		});

		let updateData = await updateRequest.json();

		if(updateData?.data?.uid) throw redirect(302, "/account/");
	}

	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Login
	 * @param {*} param0
	 * @returns
	 */
	login: async ({ cookies, fetch, locals, request, url }) => {

		let returnObj = {
			errors: []
		};

		let req = await request.formData();
		let email = req.get("email");

		/** Bounce if no email */
		if(!email) {

			returnObj.errors.push({
				name: "email",
				message: "Email is required."
			});

			return fail(401, returnObj);
		}

		let userRequest = await fetch(`/api/v1/database/user`, {
			method: "POST",
			body: JSON.stringify({
				email: email,
				type: "email"
			})
		});

		let userData = await userRequest.json();

		if(userData.errors) {
			returnObj.errors = returnObj.errors.concat(userData.errors);
		}

		if(userData?.data?._id) {

			/** Check if token already has been sent */
			if(!locals.cat && userData?.data?.auth?.token_created) {

				let now = new Date();
				let expires = new Date(userData?.data?.auth?.token_expires);

				// TODO: CHECK BELOW
				/** Potentially resend link? TBD? */
				if(now <= expires) {

					let diff = expires - now;
					let diffMinutes = Math.floor(diff / (1000 * 60));
					let diffSeconds = Math.ceil(diff / 1000) - Math.floor((diffMinutes) * 60);

					returnObj.errors.push({
						name: "fail",
						message: `Login link already sent to your email inbox, link expires in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ${diffSeconds} second${diffSeconds > 1 ? "s" : ""}.`
					});

					return fail(401, returnObj);
				}
			}

			/** Check token */
			if(userData?.data?.auth_token && locals.cat && locals.cat === userData.data.auth_token) {
				console.log("has matching token");
				// TODO: Workflow to switch auth? Block access?
			}

			let updateRequest = await fetch("/api/v1/database/user", {
				method: "POST",
				body: JSON.stringify({
					id: userData.data._id,
					last_auth: userData.data.auth,
					type: "auth_create"
				})
			});

			let updateData = await updateRequest.json();

			if(updateData?.data) {

				// TODO: REMOVE LOGIN LINK
				returnObj.errors.push({
					name: "success",
					message: `Check your email for your login link. DEMO: <a class="btn-text" href="${url.origin}${url.pathname}?k=${updateData.data}">CLICK THIS TO SIGN IN</a>`
				});

			} else {

				returnObj.errors.push({
					name: "fail",
					message: `Something went wrong. Please refresh the page and try again.`
				});

				return fail(401, returnObj);
			}
		}

		returnObj.data = userData.data;

		return returnObj;
	},
	/**
	 *
	 * @param {*} param0
	 * @returns
	 */
	request: async ({ cookies, fetch, request, url }) => {

		let returnObj = {
			errors: []
		};

		let req = await request.formData();
		let email = req.get("email");

		// TODO: Set up Rate limit response on this (10 minute time out?)

		/** Bounce if no email */
		if(!email) {

			returnObj.errors.push({
				name: "email",
				message: "Email is required."
			});

			return fail(401, returnObj);
		}

		let userRequest = await fetch(`/api/v1/database/user`, {
			method: "POST",
			body: JSON.stringify({
				email: email,
				type: "email"
			})
		});

		let userData = await userRequest.json();
		let options = {};

		if(userData.errors.length > 0) {

			returnObj.errors = returnObj.errors.concat(userData.errors);

			return fail(401, returnObj);
		}

		if(userData?.data?._id) {

			try {

				let settings = {
					rpID: url.hostname,
					userVerification: "preferred"
				};

				/** User has passkeys generated */
				if(typeof userData?.data?.passkeys === "object") {

					let keyArray = userData.data.passkeys.map(auth => ({
						id: Buffer.from(auth.credentialID, "base64"),
						type: "public-key"
						// publicKey: Buffer.from(auth.credentialPublicKey)
					}));

					settings.allowCredentials = keyArray;
				}

				/** Create auth options object */
				options = await generateAuthenticationOptions(settings);

				returnObj.data = options;

				/** Store challenge in a cross-device cookie, Base64Encoded */
				let challenge = Buffer.from(options.challenge).toString("base64");
				let timeout = 180; // 3 min
				let date = new Date();

				date.setTime(date.getTime() + (timeout * 1000));

				cookies.set("chl", encodeURIComponent(challenge), {
					httpOnly: true,
					expires: date
				});

			} catch(err) {

				returnObj.errors.push(err);

				return fail(401, returnObj);
			}
		}

		return returnObj;
	},
	/**
	 *
	 * @param {*} param0
	 */
	verify: async ({ cookies, fetch, locals, request, url }) => {

	},
	logout: async ({ cookies, fetch, locals, request, url }) => {

		if(locals.cat) {

			try {

				let updateRequest = await fetch("/api/v1/database/user", {
					method: "POST",
					body: JSON.stringify({
						id: locals.userid,
						token: locals.cat,
						type: "auth_remove"
					})
				});

				let updateData = await updateRequest.json();

			} catch(error) {

			}
		}

		cookies.delete("cat", { path: "/" });

		locals.cat = null;
		locals.user = null;

		/** Reset UID */
		let anonId = uuid();

		locals.userid = anonId;

		cookies.set("uid", anonId, {
			path: "/",
			httpOnly: true
		});

		// TODO: Update Analytics object?
	}
};