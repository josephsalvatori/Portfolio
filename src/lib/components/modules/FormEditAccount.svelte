<script>
import { enhance } from "$app/forms";
import Button from "$lib/components/molecules/Button.svelte";
import FormField from "$lib/components/molecules/FormField.svelte";
import { validate } from "$js/_helpers/forms";
import { page } from "$app/stores";
import Grid from "$lib/components/slots/Grid.svelte";

export let account = null;

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

	return async({ result, update }) => {

		errors = [];

		processing = false;

		if(result.type === "failure") {

			errors = result.data.errors;

			return;
		}

		update();
	}
};
</script>

<section class="w-full">
	<form method="POST" use:enhance={handleSubmit}>
		<input type="hidden" name="token" value={$page.data.token} />
		<Grid max={2}>
			<div class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)] richtext">
				<div class="richtext">
					<h4>Edit Information</h4>
					<p></p>
				</div>
				{#if errors.length > 0}
					<div class="error-wrapper">
						<ul class="errors">
							{#each errors as error}
								{#if error?.name !== "password" && error?.name !== "confirm_password"}
									<li>{error.message || error}</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
				<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
					<FormField error={errors.find((k) => k.name === "first_name")} id={randomId} label={"First Name"} name="first_name" type="text" value={(account?.firstName || "")} />
					<FormField error={errors.find((k) => k.name === "last_name")} id={randomId} label={"Last Name"} name="last_name" type="text" value={(account?.lastName || "")} />
				</div>
				<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
					<FormField error={errors.find((k) => k.name === "phone")} id={randomId} label={"Phone Number"} name="phone" type="tel" value={(account?.phone || "")} />
					<FormField id={randomId} label={"Marketing Opt-In"} name="accepts_marketing" checked={(account?.acceptsMarketing) ? "checked" : false} type="checkbox" value={true} />
				</div>
				<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
					<Button type="submit">Save Information</Button>
				</div>
			</div>
			<div class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)] richtext">
				<div class="richtext">
					<h4>Edit Password</h4>
					<p></p>
				</div>
				{#if errors.length > 0}
					<div class="error-wrapper">
						<ul class="errors">
							{#each errors as error}
								{#if error?.name === "password" || error?.name === "confirm_password"}
									<li>{error.message || error}</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
				<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
					<FormField error={errors.find((k) => k.name === "new_password")} id={randomId} label={"New Password"} name="new_password" type="password" />
					<FormField error={errors.find((k) => k.name === "confirm_password")} id={randomId} label={"Confirm Password"} name="confirm_password" type="password" />
				</div>
				<div class="grid xs:grid-cols-2 gap-[var(--grid-gap)]">
					<Button type="submit">Update Password</Button>
				</div>
			</div>
		</Grid>
	</form>
</section>