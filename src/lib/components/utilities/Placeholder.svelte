<script>
export let type = "text";
export let style = "";
</script>

{#if type === "image"}
	<div class="placeholder absolute h-full left-0 object-cover top-0 w-full"></div>
{:else if type === "button"}
	<button class="placeholder h-[44px] rounded-[var(--border-radius-inner)] w-[100px]" type="button">&nbsp;</button>
{:else if type === "link"}
	<p class="placeholder rounded-[var(--border-radius)] w-[100px]">&nbsp;</p>
{:else if type === "headline"}
	<p class="placeholder rounded-[var(--border-radius)] w-[200px] {style}">&nbsp;</p>
{:else}
	<p class="placeholder rounded-[var(--border-radius)]">&nbsp;</p>
	<p class="placeholder rounded-[var(--border-radius)]">&nbsp;</p>
	<p class="placeholder rounded-[var(--border-radius)]">&nbsp;</p>
{/if}