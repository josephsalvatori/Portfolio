<script>
import { page } from "$app/stores";
import FormEditAccount from "$lib/components/modules/FormEditAccount.svelte";
import DashboardNavSettings from "$lib/components/sections/DashboardNavSettings.svelte";
import DashboardSectionHeader from "$lib/components/sections/DashboardSectionHeader.svelte";
import Button from "$lib/components/molecules/Button.svelte";
import { user } from "$lib/stores/user";
import { browserSupportsWebAuthn, startRegistration } from "@simplewebauthn/browser";
import Debug from "$lib/components/Debug.svelte";

let authenticatorObjects = $user.data.passkeys || [];
let hasAuthnSupport = browserSupportsWebAuthn();

const createPasskey = async () => {

	/** Get challenge from the server */
	let registerAuth = await fetch("/api/v1/auth/register", {
		method: "POST",
		body: JSON.stringify({
			id: $user.data.uid,
			name: `${$user.data.email}`
		})
	});

	let registerResults = await registerAuth.json();

	/** Start authentication */
	let startAuth;

	try {

		startAuth = await startRegistration(registerResults);

		console.log("startAuth", startAuth);

	} catch(error) {

		console.log(error);
	}

	/** Run Verficiation */
	let verifyAuth;
	let verifyResponse;

	if(startAuth) {

		verifyAuth = await fetch("/api/v1/auth/register/verify", {
			method: "POST",
			body: JSON.stringify({
				id: $user.data._id,
				auth: startAuth
			})
		});

		verifyResponse = await verifyAuth.json();

		console.log(verifyResponse);
	}

};
</script>

<DashboardSectionHeader label={"Settings"}>
	<DashboardNavSettings />
</DashboardSectionHeader>

<div>

	{#if hasAuthnSupport}
		<!-- Create Passkeys -->
		<Button type={"button"} on:click={createPasskey}>Test</Button>
	{/if}

	{#each authenticatorObjects as authObj}

		<Debug object={authObj} />

	{/each}
</div>