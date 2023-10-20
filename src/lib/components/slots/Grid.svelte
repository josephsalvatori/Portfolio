<script>
export let max = 3;
export let min = 1;
export let breakEven = false;
export let flexLast = false;
export let gap = true;

/** Cap max columns */
if(max > 5) max = 5;
</script>

<div class="grid-area-{max} grid-min-{min} {gap === true ? "gap-x-[var(--grid-gap-x,_30px)] gap-y-[var(--grid-gap-y,_30px)]" : ""} {breakEven === true ? "grid-break-even" : ""} {flexLast === true ? "grid-flex" : ""}">
	<slot />
</div>