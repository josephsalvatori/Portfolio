<script>
import { browser } from "$app/environment";
import Button from "$lib/components/molecules/Button.svelte";
import FormField from "$lib/components/molecules/FormField.svelte";
import FormErrors from "$lib/components/molecules/FormErrors.svelte";
import Form from "$lib/components/slots/Form.svelte";
import { browserSupportsWebAuthn, startAuthentication } from "@simplewebauthn/browser";
import { ArrowRightIcon } from "svelte-feather-icons";

let form;
let errors = [];
let results = {};
let randomId = Math.floor(Math.random() * 8998) + 1001;
let passKeyLogin = false;
let processingRequest = false;
let formAction = "/account/login/?/login";

if(browser) {

	passKeyLogin = browserSupportsWebAuthn();

	if(passKeyLogin) formAction = "/account/login/?/request";
}

const runAuthFlow = async (data, form = null) => {

	if(!data.challenge) return;

	/** Start authentication */
	let startAuth;
	let res = {};

	try {

		startAuth = await startAuthentication(data);

	} catch(err) {

		console.log(form, formAction);
		formAction = `/account/login/?/login`;

		res.errors = [{ error: "auth", message: `Device timed out or is not configured for passkey access. <button class="btn-text" type="submit" form="${form.id}">Click here to receive a login link</button> to your email address.` }];

		return res;
	}

	/** Run Verficiation */
	let verifyAuth;
	let verifyResponse;

	if(startAuth) {

		verifyAuth = await fetch("/api/v1/auth/login/verify", {
			method: "POST",
			body: JSON.stringify({
				id: startAuth.response.userHandle,
				auth: startAuth
			})
		});

		verifyResponse = await verifyAuth.json();

	}
}
</script>

<section class="p-[var(--content-gutter)] m-auto w-full max-w-[480px]">
	<Form form={form} method={"POST"} action={formAction} callback={(passKeyLogin) ? runAuthFlow : false} let:errors={errors} let:results={results} btnText={"Log in"}>
		<div class="richtext text-center" slot="header">
			<h2 class="h3">Welcome back</h2>
			<p>Enter email below to log in to your account.</p>
		</div>
		<div class="grid grid-col gap-[var(--grid-gap)]">
			<div class="grid gap-[var(--grid-gap)]">
				<FormField error={errors.find((k) => k.name === "email")} id={randomId} label={"Email Address"} name="email" type="email" placeholder="hello@website.com" validate={true} />
			</div>
		</div>
		<div class="richtext" slot="footer">
			<div class="flex items-center justify-between">
				<p>Need an account?</p>
				<Button href="/account/register/" style="text">
					<span class="flex items-center whitespace-nowrap">
						<span class="mr-[5px]">Sign up</span>
						<ArrowRightIcon size={"16"} strokeWidth={1.25} />
					</span>
				</Button>
			</div>
		</div>
	</Form>
</section>