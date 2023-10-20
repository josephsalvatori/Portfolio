<script>
import { page } from "$app/stores";
import Price from "$lib/components/molecules/Price.svelte";
import Quantity from "$lib/components/molecules/Quantity.svelte";
import CartAddSubscription from "$lib/components/modules/CartAddSubscription.svelte";
import { user } from "$lib/stores/user";
import { context } from "$lib/stores/storage";
import { formatCartLines } from "$js/_helpers/cart";
import { slugify } from "$js/_helpers/slugify";

/** Defaults */
export let product = null;
export let selectedImage = null;
export let selectedPrice = null;
// export let defaultImage = null; // TODO: Allow a different first selected image
export let selectedVariant;
export let shoppable = true;
export let padding = false;

let defaultSize = $user.shop.size || "M";

const changeImage = (variant) => {

	if(!variant.variant || !variant?.variant?.node?.image?.url) return;

	selectedImage = variant.variant.node.image.url;
};

const changePrice = (variant) => {

	if(!variant.variant || !variant?.variant?.node?.price?.amount) return;

	selectedPrice = parseFloat(variant.variant.node.price.amount);
};

/**
 * ProductForm
 */
let form, variantForm;
let productId = product.id.replace(/[^0-9]/g, "");
let variants = product.variants.edges || [];
let optionArray = product.options.map((o) => o?.name);
let firstSelectedOrAvailable = variants.find((v) => v.node.availableForSale === true);

let processing = false;
let selected = {
	options: {},
	variant: {}
};

/**
 * ProductForm~onSubmit
 */
const onSubmit = async (event) => {

	if(processing === true) return;

	processing = true;

	let form = new FormData(event.srcElement);
	let payload = {};

	form.forEach((value, key) => payload[key] = value);

	let response = await fetch(event.srcElement.action, {
		method: event.srcElement.method,
		body: JSON.stringify(payload)
	});

	let data = await response.json();

	if(data?.cartId) {
		$user.shop.cart.obj = data.cart;
		$user.shop.cart.id = data.cartId;

		$context.screens.cart.op = true;
	}

	processing = false;
};

/**
 * ProductForm~setSelectedVariant
 */
const setSelectedVariant = () => {

	if(!selected.options) return;

	let variantArray = optionArray.map((o, i, []) => selected.options[slugify(o)]);
	let variantString = variantArray.join(" / ");

	selected.variant = variants.find((v) => v.node.title == variantString);
	console.log(selected.variant, selected.sellingPlan);
	if(selected.sellingPlan) selected.sellingPlan = selected.variant.node.sellingPlanAllocations.edges.find((v) => v.node.sellingPlan.id === selected.sellingPlan.node.sellingPlan.id);
	selected = selected;

	changeImage(selected);
	changePrice(selected);
};

/**
 * ProductForm~setSelectedOptions
 */
const setSelectedOptions = (event) => {

	let input = event.target;
	let type = input.name;

	selected.options[type] = input.value;

	/** --- now set variant --- */
	setSelectedVariant();
};

/**
 * ProductForm~getSelectedOptions
 */
const getSelectedOptions = () => {

	if(!selected.variant) return;

	let variantTitle = selected.variant?.node?.title;
	let variantSplit = variantTitle.split("/");
	let options = {};

	options[slugify(optionArray[0])] = variantSplit[0].trim();

	if(optionArray[1] && variantSplit[1]) options[slugify(optionArray[1])] = variantSplit[1].trim();
	if(optionArray[2] && variantSplit[2]) options[slugify(optionArray[2])] = variantSplit[2].trim();

	selected.options = options;
	selected = selected;
};

/**
 * Selling Plan adjustments
 */
const setSellingPlan = (event) => {

	let input = event.target;
	let type = input.name;

	if(type === "sellingPlanId" && input.value !== "") {
		selected.sellingPlan = selected.variant.node.sellingPlanAllocations.edges.find((s) => s.node.sellingPlan.id === input.value);
	} else {
		selected.sellingPlan = null;
	}
};

if(firstSelectedOrAvailable) {

	selected.variant = firstSelectedOrAvailable;

	getSelectedOptions();
}

/** Reactives */
$: price = selected.sellingPlan?.node?.priceAdjustments[0]?.price?.amount || selected.variant?.node?.price?.amount || null;
$: comparePrice = selected.sellingPlan?.node?.priceAdjustments[0]?.compareAtPrice?.amount || selected.variant?.node?.compareAtPrice?.amount || null;
$: variantId = selected.variant?.node?.id || null;
$: quantity = 1;

$: if(selected?.variant?.node && selectedVariant.node.id !== selected?.variant?.node?.id) {
	selectedVariant = selected.variant;
}
</script>

<div class="">
	{#if product.variants.edges.length > 1}
		<form class="{padding === true ? "p-[var(--content-gutter)] border-b-2" : ""}" bind:this={variantForm} on:submit|preventDefault on:change={setSelectedOptions}>
			{#each product.options as option, i}
				{@const text = slugify(option.name)}
				<div class="{i > 0 ? "mt-[var(--content-gap)]" : ""}">
					<legend>
						{option.name}
						{#if text === "size"}
							<!-- svelte-ignore a11y-invalid-attribute -->
							<button type="button" class="btn-text ml-[12px]" href="javascript:void(0);">Size Chart</button>
						{/if}
					</legend>
					<div class="flex flex-wrap gap-[10px]">
						{#each option.values as value}
							{@const valueText = slugify(value)}
							<div class="mb-[4px]">
								<input class="btn-option sr-only" id={`product_${productId}_${text}_${valueText}`} type="radio" name={`${text}`} value={value} checked={(selected.options[text] === value ? "checked" : false)} />
								<label for={`product_${productId}_${text}_${valueText}`}>
									{value}
								</label>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</form>
	{/if}
	{#if shoppable}
		<form class="w-full {padding === true ? "p-[var(--content-gutter)] brd-accent border-b-2" : ""}" method="POST" action="/api/v1/storefront/cart/add" bind:this={form} on:submit|preventDefault={onSubmit} on:change={setSellingPlan}>
			{#if selected.variant?.node}
				<input type="hidden" name="variant" bind:value={variantId} />
				<input type="hidden" name="product" bind:value={product.id} />
				{#if $user?.shop?.cart?.id}
					<input type="hidden" name="cart" value={$user.shop.cart.id} />
					<input type="hidden" name="lines" value={JSON.stringify(formatCartLines($user.shop.cart.obj))} />
				{/if}
			{/if}
			{#if selected.variant?.node?.availableForSale === true}
				<div class="dk:flex items-start justify-between">
					<Quantity bind:quantity={quantity} />
					<div class="flex flex-col items-end w-full">
						{#if selected.variant?.node?.sellingPlanAllocations?.edges[0]}
							<CartAddSubscription subscriptions={selectedVariant.node.sellingPlanAllocations.edges} selected={selected.sellingPlan} />
						{/if}
						<button class="btn items-center justify-center w-full" type="submit">
							<div class="whitespace-nowrap mr-[var(--content-gap)]">
								<Price price={(price * quantity)} comparePrice={(comparePrice * quantity)} />
							</div>
							<div class="whitespace-nowrap">Add To Cart</div>
						</button>
						{#if selected.variant?.node?.availableForSale === true && $page?.data?.ecommerce?.data?.shop_pay_button === true}
							<div style="--shop-pay-button-height: 64px; --shop-pay-button-width: 100%; ">
								<shop-pay-button store-url={($page?.data?.storefrontUrl && $page.data.storefrontUrl.indexOf("://") > -1) ? $page.data.storefrontUrl : `https://${$page.data.storefrontUrl}`} variants={`${variantId.replace("gid://shopify/ProductVariant/", "")}:${quantity}`}></shop-pay-button>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="dk:flex items-start justify-end">
					<button class="btn w-full" type="submit" disabled>Sold Out</button>
				</div>
			{/if}
		</form>
	{/if}
</div>