<script>
export let linecap = "round";
export let size = "24";
export let strokeWidth = 1;

let customClass = "";

export { customClass as class };

if(size !== "100%") {
	size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em": parseInt(size) + "px";
}
</script>
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" height={size} width={size} fill="none" stroke="currentColor" stroke-width="{strokeWidth}" stroke-linecap="{linecap}" stroke-linejoin="{linecap}" class="icon icon-account {customClass}" viewBox="0 0 24 24">
	<title>Tag</title>
	<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
	<line x1="7" y1="7" x2="7.01" y2="7"></line>
</svg>