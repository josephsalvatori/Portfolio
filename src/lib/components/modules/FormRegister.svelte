<script>
import { enhance } from "$app/forms";
import Button from "$lib/components/molecules/Button.svelte";
import FormField from "$lib/components/molecules/FormField.svelte";
import FormErrors from "$lib/components/molecules/FormErrors.svelte";
import { validate } from "$js/_helpers/forms";
import Form from "$lib/components/slots/Form.svelte";
import { ArrowRightIcon } from "svelte-feather-icons";

let errors = [];
let randomId = Math.floor(Math.random() * 8998) + 1001;
</script>

<section class="p-[var(--content-gutter)] m-auto w-full max-w-[480px]">
	<Form method={"POST"} action={"/account/register/"} let:errors={errors} btnText={"Get started"}>
		<div class="richtext text-center" slot="header">
			<h2 class="h3">Sign up for free</h2>
			<!-- TODO: Hook up to managed descritpion -->
		</div>
		<div class="grid grid-col gap-[var(--grid-gap)]">
			<div class="grid gap-[var(--grid-gap)]">
				<FormField error={errors.find((k) => k.name === "email")} id={randomId} label={"Email Address"} name="email" type="email" validate={true} />
			</div>
			<div class="grid gap-[var(--grid-gap)]">
				<FormField error={errors.find((k) => k.name === "key")} id={randomId} label={"Invitation Key"} name="key" type="password" validate={true} />
			</div>
			<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
				<FormField error={errors.find((k) => k.name === "first_name")} id={randomId} label={"First Name"} name="first_name" type="text" />
				<FormField error={errors.find((k) => k.name === "last_name")} id={randomId} label={"Last Name"} name="last_name" type="text" />
			</div>
			<div class="grid">
				<FormField id={randomId} hideSpacing={true} label={`I agree to the terms`} name="accepts_terms" type="checkbox" value={true} validate={true} />
				<small><a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a>,&nbsp;<a href="#" target="_blank" rel="noopener noreferrer">Privacy Statement</a>, and&nbsp;<a href="#" target="_blank" rel="noopener noreferrer">API &amp; SDK License Agreement</a>.</small>
			</div>
			<!-- <div class="grid gap-[var(--grid-gap)]">
				<FormField id={randomId} label={"Opt-In to our newsletter"} hideSpacing={true} disclaimer={"Hey there"} name="accepts_marketing" type="checkbox" value={true} />
			</div> -->
		</div>
		<div class="richtext" slot="disclaimer">
			<small>Here is some legal copy</small>
			<!-- TODO: Hook up to managed disclaimer -->
		</div>
		<div class="richtext" slot="footer">
			<div class="flex items-center justify-between">
				<p>Have an account?</p>
				<Button href="/account/login/" style="text">
					<span class="flex items-center whitespace-nowrap">
						<span class="mr-[5px]">Log in</span>
						<ArrowRightIcon size={"16"} strokeWidth={1.25} />
					</span>
				</Button>
			</div>
		</div>
	</Form>
</section>