<script>
import { onDestroy } from "svelte";
import Grid from "$lib/components/slots/Grid.svelte";
import Modal from "$lib/components/slots/Modal.svelte";
import Form from "$lib/components/slots/Form.svelte";
import FormField from "$lib/components/molecules/FormField.svelte";
import Debug from "$lib/components/Debug.svelte";
import Button from "$lib/components/molecules/Button.svelte";
import CardDashboardDataset from "$lib/components/modules/CardDashboardDataset.svelte";
import FormDatasetTable from "$lib/components/modules/FormDatasetTable.svelte";
import DashboardSectionHeader from "$lib/components/sections/DashboardSectionHeader.svelte";
import { user } from "$lib/stores/user";
import { addToast } from "$lib/stores/functions";

let modalOpen = false;

let errors = [];
let csvResults = [];
let processResults = {};
let fileProcessing = false;
let userId = $user.data._id;

onDestroy(() => {

	console.log("DESTROY");

	fileProcessing = false;
	csvResults = [];
});

// TODO: Manage Records
// TODO: Connect to service
// TODO: Segment records
// TODO: Filter/Sort?
/**
 * Submit dataset
 * @param {object} dataset The modified JSON dataset
 * @param {object} file The orginal file inforamtion
 */
const submitDataset = async (dataset, file) => {

	if(!dataset || !file) return false;

	let formData = new FormData();

	formData.append("dataset", JSON.stringify(dataset));
	formData.append("file", JSON.stringify(file));
	formData.append("id", userId);

	/** Debug */
	console.log("formData", [...formData.entries()]);

	// TODO: Seperate file upload and mongoDb upload to different processes

	/** Pass to MongoDb for update */
	let uploadFile = await fetch("/api/v1/database/file/create", {
		method: "POST",
		body: formData,
		// headers: {
			// "Content-Type": "multipart/form-data",
		// }
	}).catch((err) => {
		console.log(err);
	});

	/** Pass to async file upload ~ SLOW */
	// let uploadFile = fetch()

	let results = await uploadFile.json();

	console.log("RESULTS", results);

	/** Error catch */
	if(results.errors.length > 0) {

		[...results.errors].forEach(err => addToast({ message: err.message, type: "error" }));
	}

	/** Now close and reset */
	if(results?.success) {

		addToast({ message: "File uploaded successfully", type: "success", timeout: false });

		fileProcessing = false;
		modalOpen = false;
		csvResults = [];
	}
};
</script>

<DashboardSectionHeader label={"Datasets"}>
	<div class="w-auto" slot="aside">
		<Button type={"button"} style={"material"} on:click={() => {
			modalOpen = true;
		}}>
			<span>Upload New Dataset</span>
			<span></span>
		</Button>
	</div>
</DashboardSectionHeader>
<Grid max={4}>
	<CardDashboardDataset />
</Grid>

{#if modalOpen === true}
	<Modal bind:open={modalOpen}>
		{#if csvResults?.dataset && csvResults.dataset.length > 0}
			<FormDatasetTable id={userId} mode={"review"} bind:processed={processResults} bind:rawset={csvResults.dataset} />
			<footer class="sticky bottom-0 w-full p-[var(--content-gutter)]">
				<div class="flex w-full items-center justify-end">
					<Button type={"button"} style={"primary"} on:click={() => submitDataset(processResults, csvResults.file)}>
						{#if fileProcessing === true}
							<span>Processing...</span>
						{:else}
							<span>Upload File</span>
						{/if}
					</Button>
				</div>
			</footer>
			<!--
				TODO: MVP ~ Data Upload
				TODO: MVP ~ Data Confirm
					TODO: MVP ~ Show guessed column headers
				TODO: MVP ~ Column Mapping / Change column header?
				TODO: MVP ~ Select Service?
					TODO: MVP ~ Complete My Dataset (Get accurate contact info)
					TODO: MVP ~ Enhance My Dataset (add in demographic data)
					TODO: MVP ~ Geocode / Verify & Clean Addresses
					TODO: MVP ~ Verified Records (Sentiment? Relevance?)
					TODO: MVP ~ Build My Model

				TODO: MVP ~ POC ~ Build My Audience
				TODO: MVP ~ POC ~ Build My Audience WITH Model


				DATA CLEANING / COMPLIANCE
				TODO: HIPAA / PPI

			-->

			<!-- INTERSTICIAL -->

			<!--

				- if missingKeys.length is > 0
					- loop through missingKeys
					- show available "unidentified" headers, let user provide matchup
						- Optionally some fields can be dismissed as empty





			-->


			<!-- <div class="ca w-full m-auto"> -->
				<!-- <Debug object={csvResults} /> -->
			<!-- <Form action={"/account/data/?/process"} method={"POST"} bind:errors={errors} bind:results={processResults}> -->
				<!-- <FormField type="file" accept={".csv"} name={"file"} label={"Upload CSV File"} validate={true} /> -->
			<!-- </Form> -->
			<!-- </div> -->
		{:else}
			<div class="ca max-w-[600px] w-full m-auto">
				<Form action={"/account/data/?/process"} method={"POST"} enctype={"multipart/form-data"} bind:errors={errors} bind:results={csvResults}>
					<FormField type="file" accept={".csv"} name={"file"} label={"Upload CSV File"} validate={true} />
				</Form>
			</div>
		{/if}
	</Modal>
{/if}