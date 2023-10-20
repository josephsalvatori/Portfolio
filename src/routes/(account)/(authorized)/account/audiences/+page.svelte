<script>
import DashboardSectionHeader from "$lib/components/sections/DashboardSectionHeader.svelte";
</script>

<DashboardSectionHeader label={"Audiences"}>

</DashboardSectionHeader>

	<!--

		TODO: Audience create
			- Multi-step form
			- Sliders and fields for filters
				- This data goes to the model for filtering
				- TODO: Determine filters
			- Select or Upload Dataset
				- Selections from pre-uploaded datasets
				- Add in upload intersticial flow
					- Upload & View
					- Remove from audience
			- Card quick actions:
				- IF in draft mode
					- View/Edit
					- Delete
					- Purchase
				- IF in processing mode
					- Display workflow status / progress
					- View
				- IF if completed mode
					- View audience
					- Download/View Model results
					- TODO: Future phase ~ Upload Goal/ results / what is the goal / can they bind this to one/mutiple "Branches" ?
					- TODO: Future phase ~ Audience report
					- TODO: Determine if duplicate is necessary for MVP
						- Duplicate?
	-->