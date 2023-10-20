import { fail } from "@sveltejs/kit";
import Papa from "papaparse";

/** @type {import('./$types').PageServerLoad} */
export async function load({ request, url }) {

	// GET RELEVANT DATASETS IF NOT IN USER OBJECT

	return {};
};

/** @type {import('./$types').Actions} */
export const actions = {
	process: async({ fetch, request }) => {

		/**
		 * Upload file
		 */
		let returnObj = {};

		// TODO: Papaparse or D3???



		// Defaults
		let data = await request.formData();
		let file = data.get("file");
		let fileText = await file.text();

		let csv = Papa.parse(fileText);

		if(csv.errors.length > 0) {

			returnObj.errors = csv.errors;

			return fail(401, returnObj);
		}

		returnObj.data = {
			dataset: csv.data,
			file: {
				name: file.name,
				data: fileText,
				size: file.size,
				type: file.type
			}
		};

		// TODO: Move file to tmp on Vercel (limit 512MB), store path in variable for upload to Cloudflare later to pass

		return returnObj;
	},
	duplicate: async({ cookies, fetch, locals, request, url }) => {

	},
	delete: async({ cookies, fetch, locals, request, url }) => {

	},
	edit: async({ cookies, fetch, locals, request, url }) => {

	}
};