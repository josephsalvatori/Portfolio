<script>
import { refs } from "$js/_helpers/refs";
import { slugify } from "$js/_helpers/slugify";

export let props = {};
export let type = "";

let sectionPadding = props?.data?.section_padding || props?.data?.section?.data?.section_padding || "None";
let sectionBackground = props?.data?.section_background_color || props?.data?.section?.data?.section_background_color || null;
let sectionRounded = props?.data?.section_round_corners || props?.data?.section?.data?.section_round_corners || false;
</script>

<!-- TODO: Apply border radius to section -->
<section id={props?.id} class="{(type) ? `${type}-` : ""}section {(sectionPadding !== "None") ? `${refs.paddings[slugify(sectionPadding)]}` : ""} max-w-[var(--max-width)] {(sectionBackground) ? "bg-[var(--background-color)]" : ""} {sectionRounded ? "rounded-[var(--border-radius)]" : ""} overflow-hidden" data-index={props?.index} data-variation={props?.variation} style="{(sectionBackground) ? `--background-color: ${sectionBackground};` : ""}">
	<slot />
</section>