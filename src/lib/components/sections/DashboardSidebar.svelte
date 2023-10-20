<script>
import { user } from "$lib/stores/user";
import Debug from "$lib/components/Debug.svelte";
import Button from "$lib/components/molecules/Button.svelte";
import { BarChart2Icon, HomeIcon, SettingsIcon, TableIcon, UsersIcon } from "svelte-feather-icons";

</script>

<div class="{($user.config.sidebar ? "max-w-[200px] min-w-[200px]" : "max-w-[82px] min-w-[82px]")} border-r-2">
	<ul class="py-[var(--content-gap)] px-[var(--content-gap)] grid grid-col gap-[var(--grid-gap)]">
		<li class="inline-flex justify-center">
			{#if $user.config.sidebar === true}
				LOGO
			{:else}
				L
			{/if}
		</li>
		<li>
			<Button href="/account/" style={"link"} props={{
				"aria-label": "Datasets"
			}}>
				<div class="h-[30px] inline-flex items-center">
					<span class="inline-flex justify-center w-[30px]">
						<HomeIcon size={"20"} strokeWidth={"1.5"} />
					</span>
					{#if $user.config.sidebar === true}
						<span class="block w-[5px]"></span>
						<span>Dashboard</span>
					{/if}
				</div>
			</Button>
		</li>
		<li>
			<Button href="/account/data/" style={"link"} props={{
				"aria-label": "Datasets"
			}}>
				<div class="h-[30px] inline-flex items-center">
					<span class="inline-flex justify-center w-[30px]">
						<TableIcon size={"20"} strokeWidth={"1.5"} />
					</span>
					{#if $user.config.sidebar === true}
						<span class="block w-[5px]"></span>
						<span>Datasets</span>
					{/if}
				</div>
			</Button>
		</li>
		<li>
			<Button href="/account/audiences/" style={"link"} props={{
				"aria-label": "Audiences"
			}}>
				<div class="h-[30px] inline-flex items-center">
					<span class="inline-flex justify-center w-[30px]">
						<UsersIcon size={"20"} strokeWidth={"1.5"} />
					</span>
					{#if $user.config.sidebar === true}
						<span class="block w-[5px]"></span>
						<span>Audiences</span>
					{/if}
				</div>
			</Button>
		</li>
		<!-- TODO: PHASE 2 ~ REPORTS  -->
		<!-- <li>
			<Button href="/account/reports/" style={"link"} props={{
				"aria-label": "Reports"
			}}>
				<div class="h-[30px] inline-flex items-center">
					<span class="inline-flex justify-center w-[30px]">
						<BarChart2Icon size={"20"} strokeWidth={"1.5"} />
					</span>
					{#if $user.config.sidebar === true}
						<span class="block w-[5px]"></span>
						<span>Reports</span>
					{/if}
				</div>
			</Button>
		</li> -->
		<li>
			<Button href="/account/settings/" style={"link"} props={{
				"aria-label": "Settings"
			}}>
				<div class="h-[30px] inline-flex items-center">
					<span class="inline-flex justify-center w-[30px]">
						<SettingsIcon size={"20"} strokeWidth={"1.5"} />
					</span>
					{#if $user.config.sidebar === true}
						<span class="block w-[5px]"></span>
						<span>Settings</span>
					{/if}
				</div>
			</Button>
		</li>
	</ul>
</div>