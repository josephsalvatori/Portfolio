<script>
import { page } from "$app/stores";
import Grid from "$lib/components/slots/Grid.svelte";
import CardOrder from "$lib/components/modules/CardOrder.svelte";
import Debug from "$lib/components/Debug.svelte";
import DashboardSectionHeader from "$lib/components/sections/DashboardSectionHeader.svelte";


</script>

<DashboardSectionHeader label={"Welcome"}>
	<Grid max={3}>

	</Grid>
</DashboardSectionHeader>

<!-- <Grid max={3}>
	{#if $page.data.user.defaultAddress}
		{@const address = $page.data.user.defaultAddress}
		<article class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)] richtext">
			<h4>Address</h4>
			<p>
				{@html $page.data.user.defaultAddress.formatted.join(",<br />")}
			</p>
			{#if address.phone}
				<p>tel: {address.phone}</p>
			{/if}
		</article>
	{/if}
	<article class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)] richtext">
		Quick Information
	</article>
	{#if $page.data.user?.lastIncompleteCheckout}
		<article class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)] richtext">
			{$page.data.user.lastIncompleteCheckout}
		</article>
	{/if}
	{#if $page.data.user?.orders?.edges[0]}
		{@const order = $page.data.user.orders.edges[0].node}
		<CardOrder order={order} heading={"Recent Order"} visibleProducts={1} showTotals={false} />
	{/if}
	<article class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)] richtext">
		IF Rewards
	</article>
</Grid> -->