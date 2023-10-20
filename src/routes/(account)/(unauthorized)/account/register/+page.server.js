import { fail, redirect } from "@sveltejs/kit";
import { Api } from "$api";
import parsePhoneNumber from "libphonenumber-js";
import { ObjectId } from "mongodb";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, fetch, locals, params, request, url }) {

	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, fetch, locals, request, url }) => {

		let returnObj = {};

		returnObj.errors = [];

		// Defaults
		let data = await request.formData();
		let key = data.get("key");
		let email = data.get("email");
		let phone = data.get("phone");
		let firstName = data.get("first_name");
		let lastName = data.get("last_name");
		let termsOptIn = data.get("accepts_terms");

		/** Bounce if no email */
		if(!email) {

			returnObj.errors.push({
				name: "email",
				message: "Email is required."
			});

			return fail(401, returnObj);
		}

		if(!termsOptIn) {

			returnObj.errors.push({
				name: "accepts_terms",
				message: "You must agree to the terms & conditions."
			});

			return fail(401, returnObj);
		}

		/** Check if key is valid */
		let checkKey = await fetch(`/api/v1/database/access`, {
			method: "POST",
			body: JSON.stringify({
				key: key
			})
		});

		let checkKeyData = await checkKey.json();

		console.log("CHECK KEY", checkKeyData);

		if(!checkKeyData.data?.key) {

			returnObj.errors.push({
				name: "key",
				message: "Invitation key is invalid."
			});

			return fail(401, returnObj);
		}

		/** Check if User is in Database */
		let checkUserRequest = await fetch(`/api/v1/database/user`, {
			method: "POST",
			body: JSON.stringify({
				email: email,
				type: "email"
			})
		});

		let checkUserData = await checkUserRequest.json();

		/** Bounce User if account already exists */
		if(checkUserData?.data?.uid) {

			returnObj.errors.push({
				name: "email",
				message: `Account already exists, <a class="btn-text" href="/account/login/">Login here</a>.`
			});

			return fail(401, returnObj);
		}

		/** Proceed, account does not exist yet */
		let userObject = {
			email: email,
			details: {
				first_name: "",
				last_name: ""
			},
			notifications: {
				marketing_email: false,
				marketing_sms: false
			},
			phone: null,
			invite_key: checkKeyData.data._id
		};

		if(firstName) userObject.details.first_name = firstName;
		if(lastName) userObject.details.last_name = lastName;
		if(phone) {

			let phoneObject = parsePhoneNumber(phone, "US");

			if(phoneObject?.number) userObject.phone = phoneObject.format("E.164");
		}

		/** Some basic validation */
		let createRequest = await fetch(`/api/v1/database/user/create`, {
			method: "POST",
			body: JSON.stringify(userObject)
		});

		let createData = await createRequest.json();

		// TODO: Check against customer activation as an Alt state
		returnObj.errors = [{
			name: "success",
			message: "Your account has been created, <a class='btn-text' href='/account/login/'>log into your account here</a>."
		}];

		return returnObj;
	}
};