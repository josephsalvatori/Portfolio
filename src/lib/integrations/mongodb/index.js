import { dev } from "$app/environment";
import { MongoClient } from "mongodb"
import DatabaseObject from "$lib/integrations/DatabaseInterface";
import DB from "$lib/integrations/mongodb/client";

class Database extends DatabaseObject {

	constructor() {

		super();
	}

	/**
	 * client
	 * @param {*} param0
	 * @returns
	 */
	client({ fetch, request } = {}) {

	}

	async openConnection() {

	}

	async closeConnection() {

	}
}

export default Database;