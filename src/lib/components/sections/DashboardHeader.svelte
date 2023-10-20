<script>
import { enhance } from "$app/forms";
import { page } from "$app/stores";
import Breadcrumb from "$lib/components/molecules/Breadcrumb.svelte";
import Button from "$lib/components/molecules/Button.svelte";
import { user } from "$lib/stores/user";
import { MenuIcon, MoreVerticalIcon } from "svelte-feather-icons";
</script>

<header class="border-b-2 px-[var(--content-gap)] flex justify-between items-center h-[60px]">
	<div class="flex items-center">
		<Button style={"icon"} type={"button"} on:click={() => $user.config.sidebar = !$user.config.sidebar}>
			{#if $user.config.sidebar === false}
				<MoreVerticalIcon size={"22"} />
			{:else}
				<MenuIcon size={"22"} />
			{/if}
		</Button>
		{#if $page.url.pathname.indexOf("account") > -1}
			{@const urlSplit = $page.url.pathname.split("/").filter((e) => e)}
			<div class="ml-[var(--content-gap)]">
				<Breadcrumb pathArray={urlSplit} />
			</div>
		{/if}
	</div>
	<div>
		<div class="flex items-end justify-end">
			<form method="POST" action="/account/login/?/logout" use:enhance>
				<input type="hidden" name="uid" value={$user.data.uid} />
				<Button style="text" type="submit">
					Log Out
				</Button>
			</form>
		</div>
	</div>
</header>