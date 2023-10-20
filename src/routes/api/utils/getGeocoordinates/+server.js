/**
 * Workflow to return geocoords for a specific address
 */
import { error, json } from "@sveltejs/kit";
import { Client } from "@googlemaps/google-maps-services-js";
import { GOOGLE_API_KEY } from "$env/static/private";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "edge"
};

// TODO: Geocoding API is $0.005 per call?

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, locals, request, url }) {

	let req = await request.json();
	let requestObj = {
		data: {},
		errors: []
	};

	if(!req.address) {

		requestObj.errors.push({
			error: "address",
			message: "Address is required or not formatted properly"
		});

		return json(requestObj);
	}

	/** Check cache for geocoords */
	let filename = Buffer.from(req.address).toString("base64");

	console.log(req.address, filename);


	/** @type {import('@types/googlemaps').Client} */
	// const mapsClient = new Client({});

	// try {

	// 	const coords = await mapsClient.geocode({
	// 		params: {
	// 			key: GOOGLE_API_KEY,
	// 			address: req.address
	// 		}
	// 	});

	// 	let data = coords.data;

	// 	if(data.results[0]) {
	// 		requestObj.orig = req.address;
	// 		requestObj.data = data.results[0];
	// 	}

	// } catch(error) {

	// 	requestObj.errors.push(error);

	// 	return json(requestObj);
	// }

	return json(requestObj);
};