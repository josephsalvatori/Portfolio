<script>
import { page } from "$app/stores";
import Grid from "$lib/components/slots/Grid.svelte";
import CardOrder from "$lib/components/modules/CardOrder.svelte";
</script>

<div class="richtext">
	<div class="flex justify-between">
		<h3>Orders</h3>
	</div>
	<Grid max={3}>
		{#each $page.data.user.orders.edges as orderNode}
			{@const order = orderNode.node}
			<CardOrder order={order} visibleProducts={3} />
		{/each}
	</Grid>
</div>