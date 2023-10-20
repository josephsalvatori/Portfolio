<script>
import { enhance } from "$app/forms";
import Button from "$lib/components/molecules/Button.svelte";
import FormField from "$lib/components/molecules/FormField.svelte";
import FormErrors from "$lib/components/molecules/FormErrors.svelte";
import { validate } from "$js/_helpers/forms";

let errors = [];
let processing = false;
let randomId = Math.floor(Math.random() * 8998) + 1001;

/**
 *
 * @param param0
 */
const handleSubmit = ({ action, cancel, formElement, formData, submitter }) => {

	// lock
	if(processing) cancel();

	// validation
	let valid = validate(formElement, formData);

	// return if invalid
	if(valid.length > 0) {

		errors = valid;

		cancel();
	}

	processing = true;
	errors = [];

	return async({ result, update }) => {

		processing = false;

		console.log("RESULT", result);

		if(result.type === "failure" || result.data?.errors?.length > 0) {

			errors = result.data.errors;

			return;
		}

		update();
	}
};
</script>

<section class="p-[var(--content-gutter)] m-auto w-full max-w-[600px]">
	<form class="grid grid-col gap-[var(--grid-gap)]" method="POST" action="/account/recover/" use:enhance={handleSubmit}>
		<div class="richtext">
			<h2 class="h3">Forgot Password</h2>
			<p>TODO: Add instructional copy here.</p>
		</div>
		{#if errors.length > 0}
			<FormErrors errors={errors} />
		{/if}
		<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
			<FormField error={errors.find((k) => k.name === "email")} id={randomId} label={"Email Address"} name="email" type="email" />
		</div>
		<div class="grid grid-col gap-[var(--grid-gap)]">
			<Button type="submit">Submit</Button>
		</div>
	</form>
</section>