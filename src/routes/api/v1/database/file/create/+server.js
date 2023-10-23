// upload csv processing endpoint, moves to cloudfront file store
import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import DB from "$lib/integrations/mongodb/client";
import { decrypt, encrypt } from "$js/_helpers/encryption";
import { uuid } from "$js/_helpers/uuid";
import { randomBytes } from "node:crypto";

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x"
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ fetch, locals, request, setHeaders }) {

	/** Get form encoded data */
	let data = await request.formData();
	let returnObj = {
		errors: []
	};

	console.log("LET'S UPLOAD");

	try {

		/** Get JSON */
		let datasetJson = data.get("dataset");
		let fileJson = data.get("file");
		let id = data.get("id");

		/** Parse Data to manipulte */
		let file = JSON.parse(fileJson);
		let hash = (typeof randomBytes === "function") ? randomBytes(20).toString("hex") : uuid();
		let now = new Date().getTime();

		let filename = `upload_${now}_${hash}_${file.name}`;

		// TODO: Upload file to chosen service

		// TODO: Upload to mongo db records

		console.log(locals);

		let fileRecord = {
			created_at: new Date(),
			file_name: filename,
			file_location: null,
			file_note: "",
			file_size: file.size,
			file_title: file.name,
			owner: null,
			status: "draft"
		};

		if(id) fileRecord.owner = new ObjectId(id);

		// Scan mongoDb for filename
			// check if filename exists
			// check size
			// check
		console.log("upload file", fileRecord);

		/*
		"_id": {
			"$ref": "../../Common.json#/definitions/ObjectId"
		},
		"created_at": {
			"type": "string",
			"format": "date-time"
		},
		"file_name": {
			"type": "string"
		},
		"file_location": {
			"description": "The CDN url of the uploaded raw file",
			"type": "string",
			"format": "uri"
		},
		"file_note": {
			"type": "string"
		},
		"file_size": {
			"description": "The byte size of the file uploaded",
			"type": "integer"
		},
		"file_title": {
			"type": "string"
		},
		"file_type": {
			"type": "string",
			"enum": [ // TODO: Expand on the types?
				"audience",
				"report"
			]
		},
		"owner": {
			"$ref": "../../Common.json#/definitions/ObjectId"
		},
		"status": {
			"type": "string",
			"enum": [
				"draft",
				"processing",
				"ready"
			]
		}
		*/

		// if(fileUpload.ok) {
			returnObj.success = "ok";
		// }

	} catch(error) {

		returnObj.errors.push(error);

		return new Response(JSON.stringify(returnObj), {
			status: 500,
			statusText: error.message
		});
	}

	return new Response(JSON.stringify(returnObj), {
		headers: {
			"Content-Type": "application/json"
		},
		status: 200,
		statusText: "ok"
	});
};