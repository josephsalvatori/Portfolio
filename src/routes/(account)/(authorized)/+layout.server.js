import { error, redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, fetch, locals, parent, params, request, url }) {

	/** User has arrived, but we haven't loaded their data yet */
	if(locals.cat && !locals.user) {

		let userRequest = await fetch(`/api/v1/database/user`, {
			method: "POST",
			body: JSON.stringify({
				token: locals.cat,
				type: "auth_lookup"
			})
		});

		let userData = await userRequest.json();

		/** User exists */
		if(userData?.data?.uid) {

			let now = new Date();
			let tokenExpires = new Date(userData?.data?.auth?.token_expires);

			if(now <= tokenExpires) {
				locals.user = userData.data;
			}
		}
	}

	if(!locals.user) throw redirect(307, "/account/login/");

	return {
		user: locals.user
	};
}