# Workflow ~ User Account ~ Login

In this document we'll describe the workflow used to determine how a user signs into the website

When an anonymous user lands on the site, one of the first things we do is determine if their device **supports Passkey login**.

## A. Passkey

1. User submits email address in login form
2. Server-side script accepts `POST` request and checks the database for the user email address
	- If user is valid, gets previously generated passkeys
	- If user has previously generated passkeys, runs `generateAuthenticationOptions()` to create a WebAuthn _options_ object
		- If user <ins>**does not**</ins> have previously generated passkeys, use [fallback Login workflow](#b-magic-link-fallback)
	- The server-side script stores `options.challenge` hash in a cookie for **180 seconds**
	- Return options object back to client-side script
3. Client-side script accepts options object and runs `startAuthentication(options)` to trigger device Passkey promise
	- User selects valid Passkey method
	- Passkey promise response is passed to a WebAuthn validation endpoint
4. Server-side script accepts `POST` request to validate the Passkey
	- Check cookies for `options.challenge` hash
		- This has a **180 second** expiration, and will return the error _"Login prompt has expired, refresh and try again."_
	- Script then passes hash into validation object and runs `verifyAuthenticationResponse()` to check for valid WebAuthn
	- If valid, get customer data and route user to `/account/` overview page

### Relevant Files

- Server-side
	- [Login ~ Form Actions](../../src/routes/(account)/(unauthorized)/account/login/+page.server.js) \(+page.server.js\)
	- [Login ~ Verification](../../src/routes/api/v1/auth/register/+server.js) \(+server.js\)

- Client-side
	- [Login ~ Form](../../src/lib/components/modules/FormLogin.svelte) \(FormLogin.svelte\)

### Workflow Dependencies

1. [SimpleWebAuthn](https://simplewebauthn.dev/)
	- [@simplewebauthn/server](https://simplewebauthn.dev/docs/packages/server) ~ Server-side helpers for WebAuthn option creation & verification
	- [@simplewebauthn/browser](https://simplewebauthn.dev/docs/packages/browser) ~ Client-side helpers for WebAuthn prompt & initialization

```
# Server-side Options & Verfication functions
import {
	generateAuthenticationOptions,
	verifyAuthenticationResponse
} from "@simplewebauthn/server";

# Client-side Passkey check & Initialization functions
import {
	browserSupportsWebAuthn,
	startAuthentication
} from "@simplewebauthn/browser";
```

## B. "Magic Link" Fallback
