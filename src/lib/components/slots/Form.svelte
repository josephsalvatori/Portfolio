<script>
import { enhance } from "$app/forms";
import Button from "$lib/components/molecules/Button.svelte";
import FormErrors from "$lib/components/molecules/FormErrors.svelte";
import { validate } from "$js/_helpers/forms";

export let action = null;
export let callback = null;
export let form;
export let method = "GET";
export let enctype = "application/x-www-form-urlencoded";
export let btnText = "Submit";
export let formLabel = "Form";

export let errors = [];
export let results = {};

let processing = false;
let randomId = Math.floor(Math.random() * 8998) + 1001;

/**
 * handleSubmit
 * @param action
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
	// errors = [];

	return async({ result, update }) => {

		if(result.type === "failure" || (result.data?.errors && result.data?.errors?.length > 0)) {

			errors = result.data.errors;

			processing = false;

			return;
		}

		results = result?.data?.data;

		/** Callback passthrough fn */
		if(typeof callback === "function") {

			let cb = await callback(results, form);

			console.log("callback response", cb);

			if(cb.errors) {

				errors = cb.errors;

				processing = false;

				return;
			}
		}

		processing = false;

		update();
	}
};
</script>

<section aria-label={formLabel}>
	<form bind:this={form} id={`form_${randomId}`} class="grid grid-col gap-[var(--grid-gap)]" method={method} action={action} enctype={enctype} use:enhance={handleSubmit}>
		{#if $$slots.header}
			<header>
				<slot name="header" />
			</header>
		{/if}
		{#if errors.length > 0}
			<FormErrors errors={errors} />
		{/if}
		<slot {errors} {results} />
		<div class="grid gap-[var(--grid-gap)]">
			{#if processing}
				<Button type="disabled">Processing...</Button>
			{:else}
				<Button type="submit">{btnText}</Button>
			{/if}
		</div>
		{#if $$slots.disclaimer}
			<div class="grid gap-[var(--grid-gap)]">
				<slot name="disclaimer" />
			</div>
		{/if}
		{#if $$slots.footer}
			<footer class="border-t pt-[14px]">
				<slot name="footer" />
			</footer>
		{/if}
	</form>
</section>