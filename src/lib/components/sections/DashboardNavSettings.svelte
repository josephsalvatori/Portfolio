<script>
import Button from "$lib/components/molecules/Button.svelte";
</script>

<div class="[&>*]:mr-[10px] border-b-2 flex items-center mb-[var(--content-gap)] pb-[var(--content-gap)]">
	<Button href={"/account/settings/"} style={"material"}>
		<span>General</span>
		<span></span>
	</Button>
	<Button href={"/account/settings/branch/"} style={"material"}>
		<span>Branch</span>
		<span></span>
	</Button>
	<Button href={"/account/settings/organization/"} style={"material"}>
		<span>Organization</span>
		<span></span>
	</Button>
	<Button href={"/account/settings/billing/"} style={"material"}>
		<span>Billing</span>
		<span></span>
	</Button>
</div>