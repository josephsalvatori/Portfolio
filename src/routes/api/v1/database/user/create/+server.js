import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import DB from "$lib/integrations/mongodb/client";
import { uuid } from "$js/_helpers/uuid";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x"
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, locals, request }) {

	let req = await request.json();
	let returnObj = {
		errors: []
	};

	if(!req.email) {

		returnObj.errors.push({
			name: "email",
			message: "Email is required."
		});

		return returnObj;
	}

	let date = new Date();
	let uid = uuid();

	/** @type {import('./_docs/database/schema/Users.json')} */
	const userTableDefaults = {
		auth: {
			last_access_location: locals.clientIp
		},
		auth_token: null,
		created_at: date,
		invite_key: null,
		details: {
			birthday: null,
			first_name: "",
			last_name: "",
			title: ""
		},
		email: "",
		logged_in: false,
		notifications: {
			marketing_email: false,
			marketing_sms: false
		},
		phone: null,
		uid: uid,
		updated_at: date,
		status: "unverified"
	}

	let userData = {
		...userTableDefaults,
		...req
	};

	userData.invite_key = new ObjectId(userData.invite_key);

	try {

		const db = DB.db("Portfolio");

		let createDatabaseUser = await db.collection("Users").insertOne(userData);

		console.log("USER CREATED", createDatabaseUser);

		if(createDatabaseUser?.insertedId) {

			let userId = createdDatabaseUser.insertedId;

			// TODO: Billing Connection?

			// TODO: Created Branch
			const branchDefaults = {
				owner: userId,
				uid: uuid()
			};

			// TODO: Get Branch ID

			// TODO: Create Organization



		}


	} catch(error) {
		returnObj.errors.push(error);
	}

	/**
	 * Create database User
	 */

	// Create User
		// Variable User ID <ObjectId>
	// Create Billing
		// Variable Billing ID <ObjectId>
		// Add Owner: User ID <ObjectId>
	// Create Branch
		// Variable Branch ID <ObjectId>
		// Variable Branch UID
		// Assign Owner: User ID <ObjectId>
	// Create Organization
		// Variable Organization ID <ObjectId>
		// Variable Organization UID
		// Add Owner: User ID <ObjectId>
		// Add Branch <array>: Branch ID <ObjectId>
		// Add Billing ID <ObjectId>
	// Update Branch
		// Add Organization ID <ObjectId>
	// Update User
		// Add Auth ID <ObjectId>

	return json(returnObj);
};