import { dev } from "$app/environment";
import { MongoClient } from "mongodb"
import { MONGO_USER, MONGO_PASS, MONGO_URI } from "$env/static/private";

// TODO: read up on params from docs
const PARAMS = (!dev) ? "retryWrites=true" : "retryWrites=true&w=majority"
const DB_CONNECTION = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URI}/?${PARAMS}`;
const client = new MongoClient(DB_CONNECTION);

await client.connect();

export default client;