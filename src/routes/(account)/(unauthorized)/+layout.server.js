import { error, redirect } from "@sveltejs/kit";
import { Api } from "$api";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, fetch, locals, parent, params, request, url }) {

	let data = await parent();

	if(locals.user || data.user) throw redirect(307, "/account/");

	return {};
}