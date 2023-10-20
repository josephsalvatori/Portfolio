<script>
import { page } from "$app/stores";
import { enhance } from "$app/forms";
import Button from "$lib/components/molecules/Button.svelte";
import FormField from "$lib/components/molecules/FormField.svelte";
import FormErrors from "$lib/components/molecules/FormErrors.svelte";
import { validate } from "$js/_helpers/forms";
import { context } from "$lib/stores/storage";

export let addressForm = {};

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

		return;
	}

	processing = true;
	errors = [];

	return async({ result, update }) => {

		processing = false;

		if(result.type === "failure" || (result.data?.errors && result.data?.errors?.length > 0)) {

			errors = result.data.errors;

			return;
		}

		$context.closeAll();

		update();
	}
};
</script>

<form class="grid grid-col gap-[var(--grid-gap)]" method="POST" action="/account/addresses/?/delete" use:enhance={handleSubmit}>
	<input type="hidden" name="type" value={"delete"} />
	<input type="hidden" name="token" value={$page.data.token} />
	{#if addressForm?.id}
		<input type="hidden" name="id" value={addressForm.id} />
	{/if}
	<div class="grid grid-col gap-[var(--grid-gap)]">
		<Button style="text" type="submit">Delete</Button>
	</div>
</form>