<script>
import { parseCsv } from "$js/_helpers/parseCsv";
import { toTitleCase } from "$js/_helpers/strings";
import { refs } from "$js/_helpers/refs";
import { onDestroy } from "svelte";
import Grid from "$lib/components/slots/Grid.svelte";
import Debug from "$lib/components/Debug.svelte";
import { MailIcon, PhoneIcon } from "svelte-feather-icons";

/**
 * Structured dataset
 * @param {object} dataset.matchedKeys
 * @param {object} dataset.missingKeys
 * @param {string} dataset.mode
 * @param {object} dataset.referenceKeys
 * @param {object} dataset.structuredData
 */
export let dataset = null;
export let rawset = null;
export let processed = null;
export let id;
export let mode = "display";

if(!dataset && rawset) {
	dataset = parseCsv(rawset, mode);
	processed = dataset;
}

let max = 999999999999;

if(mode === "review") {
	max = 4;
}

let tableHeaders = Object.keys(dataset.referenceKeys);
let flagForUpdate = false;
let missingKeys = (dataset.missingKeys.length > 0 ? dataset.missingKeys.reduce((a, c) => (a[c] = "", a), {}) : {});
let mergedKeys = {
	...dataset.matchedKeys,
	...missingKeys
};

let mapData = [];

/**
 * Change the dataset when a column header changes
 */
const changeDataset = () => {

	let newRefs = {};

	Object.keys(mergedKeys).forEach((k) => {

		if(mergedKeys[k] !== "") newRefs[k] = dataset.headers.indexOf(mergedKeys[k]);
		console.log(k, mergedKeys[k]);
	});

	dataset = parseCsv(rawset, "review", newRefs);
	tableHeaders = Object.keys(dataset.referenceKeys);
	processed = dataset;
	mapData = updateMap();
};

// TODO: Expensive (Google = $5 / 1000, Here = $0.83 / 1000)
const updateMap = async () => {

	let count = 10;
	let subjects = (dataset.structuredData.slice(0, count));
	let addressArray = [];

	// [...subjects].forEach((row) => {

	// 	console.log("ROW", row, row.latitude, row.longitude);

	// 	if(row.latitude && row.longitude) return;

	// 	let addressObject = {};

	// 	if(row.address_1) addressObject.address_1 = row.address_1;
	// 	if(row.address_2) addressObject.address_2 = row.address_2;
	// 	if(row.province || row.provincecode) addressObject.province = row.province || row.provincecode;
	// 	if(row.zip) addressObject.zip = row.zip;
	// 	if(row.country || row.countrycode) addressObject.country = row.country || row.countrycode;

	// 	let addressString = Object.values(addressObject).join(", ");

	// 	addressArray.push(addressString);
	// });

	// let promiseArray = [];

	// [...addressArray].forEach((address) => {

	// 	if(!address || address === "") return;

	// 	let promise = fetch("/api/utils/getGeocoordinates", {
	// 		method: "POST",
	// 		body: JSON.stringify({
	// 			address: address
	// 		})
	// 	}).then(resp => resp.json());

	// 	promiseArray.push(promise);
	// });

	// Promise.all(promiseArray).then((values) => {

	// 	if(values.length > 0) {

	// 		[...values].forEach((v) => {

	// 			let index = addressArray.indexOf(v.orig);

	// 			dataset.structuredData[index].latitude = v.data?.geometry?.location?.lat;
	// 			dataset.structuredData[index].longitude = v.data?.geometry?.location?.lng;
	// 		});
	// 	}
	// });

	/** Only get geocoords we don't have */
	// let coords = await fetch("/api/utils/getGeocoordinates", {
	// 	method: "POST",
	// 	body: JSON.stringify({
	// 		addresses: addressArray
	// 	})
	// });
};

onDestroy(() => {

	if(flagForUpdate === true) {

		// TODO: Send data off for Update
		console.log("CLOSE", flagForUpdate, dataset, id);
	}
});

// TODO: Advanced tablesorter features
// TODO: How do we finance?
</script>

{#if mode !== "review"}
	<div class="richtext {mode === "review" ? "overflow-x-auto w-full sticky top-0 z-[2]" : ""}">
		<div class="table-wrapper no-border !overflow-visible !w-auto !max-w-none">
			<table class="relative">
				<thead>
					<tr>
						<th class:sticky={(mode === "review" ? false : true)} class="top-0">
							<!-- {(max < dataset.structuredData.length ? max : dataset.structuredData.length)} rows -->
						</th>
						{#each tableHeaders as th}
							<th class:sticky={(mode === "review" ? false : true)} class="top-0">{dataset.matchedKeys[th] || th}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each dataset.structuredData as item, row}
						{#if row < max}
							<tr>
								<td class="!min-w-[50px]">{row + 1}</td>
								{#each tableHeaders as td}
									<!-- <td contenteditable="true" bind:innerHTML={item[td]} on:input={() => flagForUpdate = true}> -->
									<td>
										{item[td] || ""}
									</td>
								{/each}
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else}
	<div class="border-b-2 bg-[var(--theme-color-background)] p-[var(--content-gutter)] w-full">
		<!-- <div class="mb-[var(--content-gap)]">
			<h4>Data Sample:</h4>
		</div> -->
		<Grid max={"4"} breakEven={true}>
			{#each dataset.structuredData as item, row}
				{#if row < max}
					<div class="border-2 rounded-[var(--border-radius-inner)] p-[var(--content-gutter)]">
						{#if item.first_name || item.last_name}
							<div>
								{#if item.first_name}
									{`${item.first_name.charAt(0).toUpperCase()}${item.first_name.slice(1)}`}
								{/if}
								{#if item.last_name}
									{`${item.last_name.charAt(0).toUpperCase()}${item.last_name.slice(1)}`}
								{/if}
							</div>
						{/if}
						{#if item.address_1}
							<div>
								{toTitleCase(item.address_1)}
							</div>
						{/if}
						{#if item.address_2}
							<div>
								{toTitleCase(item.address_2)}
							</div>
						{/if}
						{#if item.city || item.province || item.provincecode || item.countrycode || item.country || item.zip}
							<div class:mb-[10px]={(item.zip || item.phone)}>
								{#if item.city}
									{`${toTitleCase(item.city)}${(item.province || item.provincecode || item.countrycode || item.country || item.zip) ? ", " : ""}`}
								{/if}
								{#if item.province || item.provincecode}
									{`${(item.provincecode ? item.provincecode.toUpperCase() : toTitleCase(item.province))}${(item.countrycode || item.country || item.zip) ? ", " : ""}`}
								{/if}
								{#if item.countrycode || item.country}
									{`${(item.countrycode ? item.countrycode.toUpperCase() : toTitleCase(item.country))}`}
								{/if}
								{#if item.zip}
									{item.zip.toUpperCase()}
								{/if}
							</div>
						{/if}
						{#if item.email}
							<small class:mb-[4px]={item.phone} class="flex items-center">
								<MailIcon size={"15"} />
								<span class="ml-[8px]">{item.email}</span>
							</small>
						{/if}
						{#if item.phone}
							<small class="flex items-center">
								<PhoneIcon size={"15"} />
								<span class="ml-[8px]">{item.phone}</span>
							</small>
						{/if}
						{#if item.latitude && item.longitude}
							<small>{item.latitude} {item.longitude}</small>
						{/if}
					</div>
				{/if}
			{/each}
		</Grid>
	</div>
	<div class="border-b-2 relative">
		<Grid gap={false} max={3} flexLast={true}>
			<!-- Required table -->
			<div class="border-r-2 relative">
				<div class="absolute top-0 left-0 w-full h-full bg-green-100">

				</div>
				<!-- <Debug open={true} object={dataset} /> -->
			</div>
			<div class="richtext p-[var(--content-gutter)] h-full overflow-auto">
				<div class="richtext max-w-[840px]">
					<h3>Review data before upload</h3>
					<p>Does the above table look correct? The more inbound data we have, the more accurate the results. Select the column from your uploaded dataset that matches up with the data we process. Change reference headers below.</p>
				</div>
				<div class="table-wrapper !overflow-visible !w-full">
					<table class="relative">
						<thead>
							<tr>
								<th>Data we use</th>
								<th>Table header found in upload</th>
							</tr>
						</thead>
						<tbody>
							{#each tableHeaders as th}
								<tr>
									<td>{refs.tableHeaders[th]}</td>
									<td>
										<!-- Dropdown for "Matched Keys" -->
										<select class="max-w-[240px]" bind:value={mergedKeys[th]} on:change={changeDataset}>
											<optgroup label="Column Selected">
												<option disabled value={mergedKeys[th]}>{(mergedKeys[th] === "") ? "Data Excluded" : mergedKeys[th]}</option>
											</optgroup>
											<optgroup label="Other Columns">
												{#if mergedKeys[th] !== ""}
													<option value="">Exclude This Column</option>
												{/if}
												{#each dataset.headers as header}
													{#if header && header !== mergedKeys[th]}
														<option>{header}</option>
													{/if}
												{/each}
											</optgroup>
										</select>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				{#if dataset.missingKeys.length > 0}
					<div class="table-wrapper !overflow-visible !w-full">
						<table class="relative">
							{#if dataset.missingKeys.length > 0}
								<thead>
									<tr>
										<th>Data we use</th>
										<th>Table header found in upload</th>
									</tr>
								</thead>
								<tbody>
									{#each dataset.missingKeys as th}
										<tr class="w-full">
											<td>{refs.tableHeaders[th]}</td>
											<td>
												<!-- Dropdown for "Matched Keys" -->
												<!-- TODO: May need a plugin that converts this to a "Search" -->
												<select class="max-w-[240px]" bind:value={mergedKeys[th]} on:change={changeDataset}>
													<optgroup label="Column Selected">
														<option disabled value={mergedKeys[th]}>{(mergedKeys[th] === "") ? "Data Excluded" : mergedKeys[th]}</option>
													</optgroup>
													<optgroup label="Other Columns">
														{#if mergedKeys[th] !== ""}
															<option value="">Exclude This Column</option>
														{/if}
														{#each dataset.headers as header}
															{#if header && header !== mergedKeys[th]}
																<option>{header}</option>
															{/if}
														{/each}
													</optgroup>
												</select>
											</td>
										</tr>
									{/each}
								</tbody>
							{/if}
						</table>
					</div>
				{/if}
			</div>
		</Grid>
	</div>
{/if}