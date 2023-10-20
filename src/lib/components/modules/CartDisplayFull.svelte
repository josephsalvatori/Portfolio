<script>
import { onDestroy, onMount } from "svelte";
import { navigating, page } from "$app/stores";
import { goto } from "$app/navigation";
import CardLineItem from "$lib/components/modules/CardLineItem.svelte";
import Price from "$lib/components/molecules/Price.svelte";
import { user } from "$lib/stores/user";

const showTax = $page.data?.ecommerce_settings?.data?.display_estimated_tax || true;
const showDiscount = $page.data?.ecommerce_settings?.data?.display_discount_total || true;

let timeout;
let lock = false;
let currentUrl = $page.url.pathname;

$: btnPriceDisplay = (!showTax && !showDiscount) ? $user.shop?.cart?.obj?.cost?.subtotalAmount?.amount : $user.shop?.cart?.obj?.cost?.totalAmount?.amount

onMount(() => {
	goto(`${currentUrl}${(currentUrl.indexOf("?") > -1 ? "&cart=1" : "?cart=1")}`, { replaceState: true, noScroll: true });
});

onDestroy(() => {

	if($page.url.searchParams.get("cart")) {
		goto(`${currentUrl}`, { replaceState: true, noScroll: true });
	}
});
</script>

{#if $user?.shop?.cart?.obj}
	<div class="h-[calc(100vh_-_62px)] flex flex-col justify-between">
		<div class="p-[var(--content-gutter)] relative">
			<p class="h4 border-b-2 mb-[var(--content-gutter)] pb-[var(--content-gutter)]">Shopping Cart <sup>({$user.shop.cart?.obj?.totalQuantity})</sup></p>
			<!-- TODO: Convert to action/enhance -->
			<form method="POST" action="/api/v1/storefront/cart/update" on:submit|preventDefault>
				{#each $user.shop?.cart?.obj?.lines?.edges as lineItem, i}
					<CardLineItem bind:lock={lock} lineItem={lineItem.node} index={i} />
				{/each}
			</form>
			<div>
				UPSELL
			</div>
		</div>
		<div class="sticky bg-[var(--theme-color-background)] border-t-2 bottom-0 left-0 w-full">
			<div class="p-[var(--content-gutter)] richtext">
				<ul class="!pl-0 w-[200px]">
					{#if showTax || showDiscount}
						<li class="grid grid-cols-2">
							<span>Subtotal:</span>
							<Price price={$user.shop?.cart?.obj?.cost?.subtotalAmount?.amount} />
						</li>
					{/if}
					{#if showDiscount && $user.shop?.cart?.obj?.discountAllocations?.discountedAmount?.amount}
						<li class="grid grid-cols-2">
							<span>Discounts:</span>
							<Price price={$user.shop?.cart?.obj?.discountAllocations?.discountedAmount?.amount} />
						</li>
					{/if}
					{#if showTax && $user.shop?.cart?.obj?.cost?.totalTaxAmount?.amount && $user.shop?.cart?.obj?.cost?.totalTaxAmount?.amount > 0}
						<li class="grid grid-cols-2">
							<span>Sales Tax:</span>
							<Price price={$user.shop?.cart?.obj?.cost?.totalTaxAmount?.amount} />
							{#if $user.shop?.cart?.obj?.cost?.totalTaxAmountEstimated === true}
								(est.)
							{/if}
						</li>
					{/if}
				</ul>
				<a class="btn items-center justify-center text-center w-full" href={$user.shop.cart.obj.checkoutUrl}>
					<div class="whitespace-nowrap mr-[var(--content-gap)]">
						<Price price={btnPriceDisplay} />
					</div>
					<div class="whitespace-nowrap">Checkout</div>
				</a>
				{#if $page.data?.ecommerce_settings?.data?.checkout_disclaimer}
					<small>{$page.data.ecommerce_settings.data.checkout_disclaimer}</small>
				{/if}
			</div>
		</div>
	</div>
{/if}