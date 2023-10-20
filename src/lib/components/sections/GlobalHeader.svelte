<script>
import { beforeNavigate } from "$app/navigation";
import { page } from "$app/stores";
import IconCart from "$lib/components/molecules/icons/IconCart.svelte";
import IconAccount from "$lib/components/molecules/icons/IconAccount.svelte";
import IconSearch from "$lib/components/molecules/icons/IconSearch.svelte";
import MenuList from "$lib/components/modules/MenuList.svelte";
import MenuMega from "$lib/components/modules/MenuMega.svelte";
import MenuListMobile from "$lib/components/modules/MenuListMobile.svelte";
import MenuMegaMobile from "$lib/components/modules/MenuMegaMobile.svelte";
import CartDisplayFull from "$lib/components/modules/CartDisplayFull.svelte";
import FormLogin from "$lib/components/modules/FormLogin.svelte";
import Button from "$lib/components/molecules/Button.svelte";
import Drawer from "$lib/components/slots/Drawer.svelte";
import { context } from "$lib/stores/storage";
import { user } from "$lib/stores/user";
import { asLink, asText, isFilled } from "@prismicio/client";
import { LockIcon, UnlockIcon } from "svelte-feather-icons";

let windowWidth = 0;
let noticeHeight = 0;
let accountWidth = 0;
let cartWidth = 0;
let searchWidth = 0;
let drawerOpen = false;
let drawerWidth = 0;

beforeNavigate(() => {
	drawerOpen = false;
});
</script>

<svelte:window bind:innerWidth={windowWidth}></svelte:window>

<header style="--header-height: 60px; --notice-height: {noticeHeight}px;">
	<div class="h-[calc(var(--header-height)_+_var(--notice-height))]"></div>
	{#if windowWidth > 0}
		<nav aria-label="Main Navigation" class="">
			<div class="bg-[var(--theme-color-background)] border-b-2 cx flex fixed h-[60px] min-h-[60px] items-center justify-between left-0 top-0 w-full z-[81]">
				{#if windowWidth <= 768}
					<button type="button" class="btn-hamburger {(drawerOpen) ? "is-active" : ""} relative z-[90]" on:keydown={() => {}} on:click|preventDefault={() => { drawerOpen = !drawerOpen; }}>
						<span>
							<span></span>
						</span>
					</button>
				{:else}
					<ul class="flex h-full items-center">
						{#if isFilled.sliceZone($page?.data?.settings?.navigation?.data?.slices_header)}
							{#each $page.data.settings.navigation.data.slices_header as navList}
								{@const type = navList.slice_type}
								{@const variation = navList.variation}
								{#if type === "link"}
									<li class="mr-[var(--content-gap)]"><a class:btn={(navList.primary.link_style === "button")} href={asLink(navList.primary.link)}>{navList.primary.link_text || (navList.primary.link?.data?.title ? asText(navList.primary.link?.data?.title) : navList.primary.link.uid)}</a></li>
								{:else if type === "link_list"}
									{#if variation === "megaMenu"}
										<MenuMega data={navList} open={false} />
									{:else}
										<MenuList data={navList} open={false} />
									{/if}
								{/if}
							{/each}
						{/if}
					</ul>
				{/if}
				<ul class="flex h-full items-center">
					<!-- <li class="ml-[var(--content-gap)]">
						<button type="button" class="btn-icon flex items-center justify-center h-[30px] w-[30px]" on:click|preventDefault={() => {
							if($context.screens.search.op === true) {
								$context.closeAll();
							} else {
								$context.closeAll();
								$context.screens.search.op = true;
							}
						}}>
							<IconSearch size={"20"} strokeWidth={1.5} />
						</button>
					</li>
					{#if $user.shop.cart?.obj?.totalQuantity > 0}
						<li class="ml-[var(--content-gap)]">
							<button type="button" class="btn-icon flex relative items-center justify-center h-[30px] w-[30px]" on:click|preventDefault={() => {
								if($context.screens.cart.op === true) {
									$context.closeAll();
								} else {
									$context.closeAll();
									$context.screens.cart.op = true;
								}
							}}>
								<span class="absolute -top-px -right-px h-[16px] w-[16px] bg-[var(--theme-color-font)] text-[length:11px] leading-[16px] rounded-full text-center text-[color:var(--theme-color-background)]">{$user.shop.cart?.obj?.totalQuantity}</span>
								<IconCart size={"20"} strokeWidth={1.5} />
							</button>
						</li>
					{/if} -->
					<li class="ml-[var(--content-gap)]">
						{#if $user.data.uid}
							<Button href={"/account/"} style={"icon"}>
								<UnlockIcon size={"20"} strokeWidth={1.5} />
							</Button>
						{:else}
							<button type="button" class="flex items-center justify-center h-[30px] w-[30px]" on:click|preventDefault={() => {
								if($context.screens.account.op === true) {
									$context.closeAll();
								} else {
									$context.closeAll();
									$context.screens.account.op = true;
								}
							}}>
								<LockIcon size={"20"} strokeWidth={1.5} />
							</button>
						{/if}
					</li>
				</ul>
			</div>
			{#if windowWidth <= 768}
				{#if drawerOpen}
					<Drawer bind:open={drawerOpen} button={false} direction={"left"}>
						<ul bind:clientWidth={drawerWidth} class="flex flex-col ca min-w-[var(--drawer-width)]" style="--drawer-width: {drawerWidth > 0 ? drawerWidth + "px" : "auto"};">
							{#if isFilled.sliceZone($page?.data?.settings?.navigation?.data?.slices_header)}
								{#each $page.data.settings.navigation.data.slices_header as navList}
									{@const type = navList.slice_type}
									{@const variation = navList.variation}
									{#if type === "link"}
										<li class="pb-[var(--content-gap)]"><a class:btn={(navList.primary.link_style === "button")} href={asLink(navList.primary.link)}>{navList.primary.link_text || (navList.primary.link?.data?.title ? asText(navList.primary.link?.data?.title) : navList.primary.link.uid)}</a></li>
									{:else if type === "link_list"}
										{#if variation === "megaMenu"}
											<MenuMegaMobile data={navList} open={false} />
										{:else}
											<MenuListMobile data={navList} open={false} />
										{/if}
									{/if}
								{/each}
							{/if}
						</ul>
					</Drawer>
				{/if}
			{/if}
		</nav>
	{/if}

	{#if $context.screens.cart.op}
		<Drawer bind:this={$context.screens.cart.el} bind:open={$context.screens.cart.op} button={false} direction={"right"}>
			<div bind:clientWidth={cartWidth} class="flex flex-col min-w-[var(--drawer-width)]" style="--drawer-width: {cartWidth > 0 ? cartWidth + "px" : "auto"};">
				<CartDisplayFull />
			</div>
		</Drawer>
	{/if}
	{#if $context.screens.account.op}
		<Drawer bind:this={$context.screens.account.el} bind:open={$context.screens.account.op} button={false} direction={"right"} alignment={"center"}>
			<div bind:clientWidth={accountWidth} class="flex flex-col min-w-[var(--drawer-width)]" style="--drawer-width: {accountWidth > 0 ? accountWidth + "px" : "auto"};">
				<FormLogin />
			</div>
		</Drawer>
	{/if}
	<!-- {#if $context.screens.search.op}
		<Drawer bind:this={$context.screens.search.el} bind:open={$context.screens.search.op} button={false} direction={"right"}>
			<div bind:clientWidth={searchWidth} class="flex flex-col min-w-[var(--drawer-width)]" style="--drawer-width: {searchWidth > 0 ? searchWidth + "px" : "auto"};">
				Search
			</div>
		</Drawer>
	{/if} -->
</header>