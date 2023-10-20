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

<section class="p-[var(--content-gutter)] m-auto w-full max-w-[600px]">
	<form class="grid grid-col gap-[var(--grid-gap)]" method="POST" action="/account/addresses/?/upsert" use:enhance={handleSubmit}>
		<input type="hidden" name="type" value={addressForm.id ? "edit" : "new"} />
		<input type="hidden" name="token" value={$page.data.token} />
		{#if addressForm?.id}
			<input type="hidden" name="id" value={addressForm.id} />
		{/if}
		<div class="richtext">
			<h2 class="h3">{addressForm.id ? "Edit Address" : "New Address"}</h2>
			<p>TODO: Add instructional copy here.</p>
		</div>
		{#if errors.length > 0}
			<FormErrors errors={errors} />
		{/if}
		<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
			<FormField error={errors.find((k) => k.name === "address1")} id={randomId} label={"Street Address*"} name="address1" type="text" value={addressForm?.address1 || ""} validate={true} />
			<FormField error={errors.find((k) => k.name === "address2")} id={randomId} label={"Apt, Suite, Etc"} name="address2" type="text" value={addressForm?.address2 || ""} />
		</div>
		<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
			<FormField error={errors.find((k) => k.name === "city")} id={randomId} label={"City*"} name="city" type="text" value={addressForm?.city || ""} validate={true} />
			<FormField error={errors.find((k) => k.name === "province")} id={randomId} label={"State/Province*"} name="province" type="text" value={addressForm?.province || ""} validate={true} />
			<!-- <FormField error={errors.find((k) => k.name === "province")} id={randomId} label={"State/Province*"} name="province" options={[]} type="select" value={addressForm?.province} validate={true} /> -->
		</div>
		<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
			<FormField error={errors.find((k) => k.name === "zip")} id={randomId} label={"Zip/Postal Code*"} name="zip" type="text" value={addressForm?.zip || ""} validate={true} />
			<FormField error={errors.find((k) => k.name === "country")} id={randomId} label={"Country*"} name="country" type="text" value={addressForm?.countryCodeV2 || ""} validate={true} />
			<!-- TODO: Dynamic Country Selector, or Google autocomplete address -->
			<!-- <FormField error={errors.find((k) => k.name === "country")} id={randomId} label={"Country*"} name="country" options={[]} type="select" value={addressForm?.country} validate={true} /> -->
		</div>
		<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
			<FormField error={errors.find((k) => k.name === "first_name")} id={randomId} label={"First Name"} name="first_name" value={addressForm?.firstName || ""} type="text" />
			<FormField error={errors.find((k) => k.name === "last_name")} id={randomId} label={"Last Name"} name="last_name" value={addressForm?.lastName || ""} type="text" />
		</div>
		<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
			<FormField error={errors.find((k) => k.name === "company")} id={randomId} label={"Company"} name="company" value={addressForm?.company || ""} type="text" />
			<FormField error={errors.find((k) => k.name === "phone")} id={randomId} label={"Phone"} name="phone" value={addressForm?.phone || ""} type="text" />
		</div>
		<div class="grid grid-col gap-[var(--grid-gap)]">
			<Button type="submit">Save</Button>
		</div>
	</form>
</section>