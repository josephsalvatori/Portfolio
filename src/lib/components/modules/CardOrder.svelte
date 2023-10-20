<script>
import Button from "$lib/components/molecules/Button.svelte";
import Image from "$lib/components/molecules/Image.svelte";
import Price from "$lib/components/molecules/Price.svelte";
import Grid from "$lib/components/slots/Grid.svelte";
import IconSalesTag from "$lib/components/molecules/icons/IconSalesTag.svelte";
import { refs } from "$js/_helpers/refs";

export let heading = null;
export let order;
export let showTotals = true;
export let visibleProducts = 1;

let date = new Date(order.processedAt);
</script>

<article class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)] richtext">
	{#if heading}
		<h4>{heading}</h4>
	{/if}
	<div class="flex justify-between">
		{#if heading}
			<p>
				Order #{order.orderNumber}
				<br />
				<small class="!text-[length:14px]">{refs.months[date.getMonth()]}. {date.getDay()}, {date.getFullYear()}</small>
			</p>
		{:else}
			<p class="h5">
				Order #{order.orderNumber}
				<br />
				<small class="!text-[length:14px]">{refs.months[date.getMonth()]}. {date.getDay()}, {date.getFullYear()}</small>
			</p>
		{/if}
		<Button href={order.statusUrl} style={"text"}>View Details</Button>
	</div>
	<div class="w-full border-t-2 pt-[var(--content-gap)]">
		<p class="mb-[10px]">Order Contents:</p>
		{#each order.lineItems.edges as item, key}
			{@const lineItem = item.node}
			{#if key < visibleProducts}
				<div class="flex items-start justify-between {(key > 0) ? "mt-[20px]" : ""}">
					<div class="h-[60px] w-[60px] min-w-[60px] mr-[var(--content-gap)] rounded-[var(--border-radius-inner)] relative aspect-square overflow-hidden">
						<Image src={lineItem.variant.image.url} width={240} fit={"cover"} />
					</div>
					<div class="flex items-stretch justify-between w-full">
						<div class="mr-[var(--content-gap)]">
							<h1 class="h5">{lineItem.variant.product.title}</h1>
							<div class="mt-[10px] text-[length:14px]">
								{#each lineItem.variant.selectedOptions as option}
									<div>{option.name}: {option.value}</div>
								{/each}
							</div>
						</div>
						<div class="flex flex-1 flex-col justify-between items-end relative">
							<div class="flex">
								x{lineItem.quantity}
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/each}
		{#if order.lineItems?.edges.length > visibleProducts}
			<p class="mt-[10px]">+ {(order.lineItems.edges.length - visibleProducts)} other products</p>
		{/if}
	</div>
	<div class="w-full border-t-2 pt-[var(--content-gap)]">
		<Grid max={2}>
			<div>Payment Status:</div>
			<div class="flex justify-end">
				{@html refs.purchaseStatus[order.financialStatus]}
			</div>
		</Grid>
		<Grid max={2}>
			<div>Shipment Status:</div>
			<div class="flex justify-end">
				{@html refs.shippingStatus[order.fulfillmentStatus]}
			</div>
		</Grid>
		{#if order.successfulFulfillments[0]?.trackingInfo[0]?.number}
			{#each order.successfulFulfillments as fulfillment}
				<Grid max={2}>
					<div>
						{#if fulfillment.trackingCompany !== ""}
							Shipped via {fulfillment.trackingCompany}:
						{:else}
							Tracking Information:
						{/if}
					</div>
					<div class="flex justify-end">
						{#each fulfillment.trackingInfo as tracking, i}
							{#if tracking.url}
								<Button type={"link"}>#{tracking.number}</Button>
							{:else}
								#{tracking.number}
							{/if}
							{#if i > 0}
								<br />
							{/if}
						{/each}
					</div>
				</Grid>
			{/each}
		{/if}
	</div>
	{#if showTotals}
		<div class="w-full border-t-2 pt-[var(--content-gap)]">
			<Grid max={2}>
				<div>Subtotal with Tax:</div>
				<div class="flex justify-end">
					<Price price={(parseFloat(order.subtotalPrice.amount) + parseFloat(order.totalTax.amount))} />
				</div>
			</Grid>
			<Grid max={2}>
				<div>Shipping Cost:</div>
				<div class="flex justify-end">
					<Price price={order.totalShippingPrice.amount} />
				</div>
			</Grid>
			{#if order.originalTotalDuties?.amount}
				<Grid max={2}>
					<div>Duties:</div>
					<div class="flex justify-end">
						<Price price={order.originalTotalDuties.amount} />
					</div>
				</Grid>
			{/if}
			{#if parseFloat(order.totalRefunded.amount) > 0}
				<Grid max={2}>
					<div>Refund Issued:</div>
					<div class="flex justify-end">
						<Price price={order.totalRefunded.amount} />
					</div>
				</Grid>
			{/if}
			{#if order.shippingDiscountAllocations && order.shippingDiscountAllocations.length > 0}
				<Grid max={2}>
					<div>Shipping Discount{(order.shippingDiscountAllocations.length > 1 ? "s" : "")}:</div>
					<div class="flex items-center justify-end whitespace-nowrap">
						{#each order.shippingDiscountAllocations as discount, i}
							{#if discount.discountApplication?.value?.percentage === 100}
								<small class="inline-flex items-center mr-[20px]">
									<div class="h-[14px] w-[14px]"><IconSalesTag size={"14"} /></div>
									<span class="ml-[4px] leading-none">FREE SHIPPING</span>
								</small>
							{/if}
							{#if discount.discountApplication?.value?.percentage > 0 && discount.discountApplication?.value?.percentage < 100}
								<small class="inline-flex items-center mr-[20px]">
									<div class="h-[14px] w-[14px]"><IconSalesTag size={"14"} /></div>
									<span class="ml-[4px] leading-none">{discount.discountApplication?.value?.percentage}% OFF</span>
								</small>
							{/if}
							<span><Price negative={true} price={discount.allocatedAmount.amount} /></span>
							{#if i > 0}
								<br />
							{/if}
						{/each}
					</div>
				</Grid>
			{/if}
			<div>&nbsp;</div>
			<Grid max={2}>
				<div>Total:</div>
				<div class="flex justify-end">
					<Price price={order.totalPrice.amount} />
				</div>
			</Grid>
		</div>
	{/if}
</article>