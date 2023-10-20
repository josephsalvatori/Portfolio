<script>
export let label = "";
</script>

<div class="">
	<div class="border-b-2 flex justify-between mb-[var(--content-gap)] pb-[var(--content-gap)] richtext">
		<h3>{label}</h3>
		<slot name="aside" />
	</div>
	<slot />
</div>