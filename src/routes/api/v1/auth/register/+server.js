import { error, json } from "@sveltejs/kit";
import { generateRegistrationOptions } from "@simplewebauthn/server";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x"
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, locals, request, url }) {

	let req = await request.json();
	let requestObj = {
		data: {},
		errors: []
	};
	let options = {};

	try {

		const { id, name } = req;

		/** Create auth options object */
		options = await generateRegistrationOptions({
			rpName: "dark-mode-app",
			rpID: url.hostname,
			userID: id,
			userName: name,
			authenticatorSelection: {
				authenticatorAttachment: "platform",
				userVerification: "required",
				residentKey: "preferred"
			}
		});

		requestObj.data = options;

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

		requestObj.errors.push(err);

		throw new error(500, requestObj);
	}

	return json(options);
};