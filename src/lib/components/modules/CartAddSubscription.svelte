<script>
import FormField from "$lib/components/molecules/FormField.svelte";

export let selected = null;
export let subscriptions = [];

$: inSubs = (subscriptions.find((s) => s.node.sellingPlan.id === selected?.node?.sellingPlan?.id));
</script>

<div class="w-full mb-[var(--grid-gap)]">
	<legend>Subscribe</legend>
	<FormField type="radio" name="sellingPlanId" label={"One-time Purchase"} checked={(inSubs) ? false : true} hideSpacing={true} />
	{#each subscriptions as item}
		{@const subscription = item.node}
		{@const discount = 1 - (subscription.priceAdjustments[0].price.amount / subscription.priceAdjustments[0].compareAtPrice.amount)}
		{@const planName = (discount > 0) ? `<span>${subscription.sellingPlan.name}</span> <small style="margin-left:10px;">(save ${(discount * 100).toFixed(2).replace(".00", "")}%)</small>` : subscription.sellingPlan.name}
		{@const checked = (subscriptions.find((s) => s.node.sellingPlan.id === selected?.node?.sellingPlan?.id))}
		<FormField type="radio" name="sellingPlanId" label={planName} hideSpacing={true} checked={(checked) ? true : false} value={subscription.sellingPlan.id} />
	{/each}
</div>