<script>
import { onMount } from "svelte";
import Debug from "$lib/components/Debug.svelte";
import Toasts from "$lib/components/modules/Toasts.svelte";
import Button from "$lib/components/molecules/Button.svelte";
import DashboardFooter from "$lib/components/sections/DashboardFooter.svelte";
import DashboardHeader from "$lib/components/sections/DashboardHeader.svelte";
import DashboardSidebar from "$lib/components/sections/DashboardSidebar.svelte";
import { user } from "$lib/stores/user";
import { context } from "$lib/stores/storage";

export let data;

let windowHeight = 0;
let windowWidth = 0;

if(!$user.uid && data.user?.uid) $user.data = data.user;

onMount(() => { $context.closeAll(); });
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth}></svelte:window>

<style lang="scss" global>
@import "./src/code/css/dashboard.scss";
</style>

<Toasts />
<DashboardHeader />
{#if windowHeight > 0}
	<div class="h-[calc(var(--windowHeight)_-_60px)] tb:flex" style="--windowHeight: {windowHeight}px;">
		<DashboardSidebar />
		<div class="bg-gray-100 ca h-full overflow-auto relative w-full">
			<div class="max-w-full h-full w-full">
				<slot />
				<Debug title="USER" object={$user} />
			</div>
			<!-- <DashboardFooter /> -->
		</div>
	</div>
{/if}