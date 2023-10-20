import { fail } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ request, url }) {

	return {};
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async({ cookies, fetch, locals, request, url }) => {

		/**
		 * Upload file
		 */
		let returnObj = {};

		return returnObj;
	}
};