import { fail, redirect } from "@sveltejs/kit";
import { Api } from "$api";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, fetch, locals, params, request, url }) {

	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ locals, request, url }) => {

		let returnObj = {};

		returnObj.errors = [];

		// Defaults
		let data = await request.formData();
		let email = data.get("email");

		if(!email) return fail(401, returnObj.errors = { name: "email", message: "Email is required." });

		let query = `mutation customerRecover($email: String!) {
			customerRecover(email: $email) {
				customerUserErrors {
					code
					field
					message
				}
			}
		}`;

		let variables = {
			email: email
		};

		let shopRequest = await Api.Storefront.client({ fetch, query, variables });

		// Fail
		if(shopRequest?.data?.customerRecover?.customerUserErrors[0] || shopRequest.errors) {

			returnObj.errors = shopRequest.data?.customerRecover?.customerUserErrors || shopRequest.errors;

			return fail(401, returnObj);
		}

		returnObj.errors = [{
			name: "success",
			message: "Check your inbox for password reset instructions."
		}];

		return returnObj;
	}
};