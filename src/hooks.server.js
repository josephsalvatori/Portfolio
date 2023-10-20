/** @type {import('@sveltejs/kit').Handle} */
export const handle = async({ event, resolve }) => {

	/**
	 * Cookies we'll need to check
	 * @param {string} uid user ID
	 * @param {string} uat user auth tokan
	 */
	const uid = event.cookies.get("uid");
	const cat = event.cookies.get("cat");

	event.locals.clientIp = event.getClientAddress();
	event.locals.userid = uid || crypto.randomUUID();
	event.locals.cat = cat || null;

	if(!uid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		event.cookies.set("uid", event.locals.userid, {
			path: "/",
			httpOnly: true
		});
	}

	return resolve(event);
};