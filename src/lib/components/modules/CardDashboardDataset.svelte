<script>
import { CopyIcon, EditIcon, EyeIcon, ShareIcon, Trash2Icon } from "svelte-feather-icons";
import FormDatasetTable from "$lib/components/modules/FormDatasetTable.svelte";
import Button from "$lib/components/molecules/Button.svelte";
import FormField from "$lib/components/molecules/FormField.svelte";
import Tooltip from "$lib/components/slots/Tooltip.svelte";
import Modal from "$lib/components/slots/Modal.svelte";
import Form from "$lib/components/slots/Form.svelte";

// TODO: MVP ~ Data uploading
/**
 * - Do we cap max columns per upload?
 * - Do we cap upload filesize?
 */
export let dataset = {
	_id: "1234567890abcdefg",
	created_at: "2023-09-01T14:51:32.075Z",
	updated_at: "2023-10-01T14:51:32.075Z",
	file_name: "example.csv",
	file_location: "/url/to/file/location/",
	file_size: 1231231234,
	file_type: "audience",
	owner: "1234567890abcdefg"
};

let EXAMPLE_DATA = {"structuredData":[{"first_name":"joseph","last_name":"salvatori","address_1":"4651 n ironwood ln","city":"glendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53209-6522","email":"jsalvatori@commonstate.com","phone":"+16308314459"},{"first_name":"james","last_name":"pellizzi","address_1":"1433 north water street","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53202","email":"james@pellizziandcompany.com","phone":"+12624044408"},{"first_name":"cory","last_name":"ampe","address_1":"4530 n marlborough dr","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211-1304","email":"cory@design414.com","phone":"+14145263868"},{"first_name":"pamela","last_name":"ferderbar","address_1":"422 west national avenue","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53204","email":"pam@pamferderbar.com"},{"email":"aaron.miller@rdcwi.com"},{"first_name":"jason","last_name":"evans","address_1":"2024 north hubbard street","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53212","email":"jevansdigital@gmail.com","phone":"+14147328389"},{"first_name":"john","last_name":"sanders","address_1":"7227 n barnett ln","city":"fox point","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53217","email":"jaysanders.mail@gmail.com","phone":"(414) 791-9863"},{"first_name":"genyne","last_name":"edwards jd","address_1":"1916 north doctor martin luther king junior drive","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53212","email":"eingenuity@gmail.com"},{"first_name":"caitlin","last_name":"knudsen","address_1":"4651 north ironwood lane","city":"glendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53209","email":"caknudsen@gmail.com","phone":"+16086958889"},{"first_name":"mike","last_name":"grubich","address_1":"375 bishops way, suite 230","city":"brookfield","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53005","email":"mgrubich@lak-group.com"},{"first_name":"tamalyn","last_name":"powell","address_1":"250 w coventry court","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53217","email":"tamalyn.powell@bvk.com","phone":"+14142472148"},{"first_name":"carrie","last_name":"killoran","address_1":"2607 n wahl ave","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"cnkilloran@gmail.com","phone":"+14149157314"},{"first_name":"carley","last_name":"knight","address_1":"3659 east allerton avenue","city":"cudahy","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53110","email":"carley@carleyknight.com","phone":"(414) 659-0307"},{"first_name":"dale","last_name":"knaak","address_1":"4324 south 14th street","city":"sheboygan","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53081","email":"dki920@yahoo.com"},{"first_name":"robert","last_name":"davis","address_1":"425 east menomonee street","address_2":"407","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53202","email":"bertdvm@gmail.com","phone":"+14144298910"},{"email":"maebh.jackson@gmail.com"},{"first_name":"tom","last_name":"martin","address_1":"8229 rockway pl","city":"wauwatosa","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53213","email":"tmmartin@gmail.com","phone":"+14143742003"},{"first_name":"barry","last_name":"clark","address_1":"1840 n 68th st","city":"wauwatosa","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53213","email":"barrypaulclark@gmail.com","phone":"+14149152181"},{"first_name":"mike","last_name":"betette","address_1":"3412a n fratney st","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53212","email":"mike.betette@gmail.com","phone":"+13236053431"},{"first_name":"dennis","last_name":"robert","address_1":"2736 north downer avenue","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"dennis@core.com"},{"first_name":"susan","last_name":"ruggles","address_1":"5779 n bel aire dr","city":"glendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53209","email":"slruggles@wi.rr.com","phone":"'+1 414-688-3772"},{"first_name":"carolyn","last_name":"mckenzie","address_1":"1308 n 44th st","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53208","email":"carriemck@me.com","phone":"+14143240021"},{"first_name":"carlos","last_name":"schmitt","address_1":"612 lakeview drive","city":"mcadenville","province":"north carolina","provincecode":"nc","country":"united states","countrycode":"us","zip":"28101","email":"oilpaintdrops@yahoo.co","phone":"+14146884350"},{"first_name":"tom","last_name":"tester","address_1":"123 test rd","city":"test","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53202","email":"test@test.com","phone":"2312312344"},{"first_name":"joseph","last_name":"salvatori","address_1":"4651 n ironwood ln","city":"glendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53209-6522","email":"jsalvatori+1@commonstate.com","phone":"(630) 831-4459"},{"first_name":"joseph","last_name":"salvatori","address_1":"4651 n ironwood ln","address_2":"317","city":"glendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53209-6522","email":"jsalvatori+2@commonstate.com","phone":"6308314459"},{"first_name":"christa","last_name":"pipitone","address_1":"707 heidel rd","city":"thiensville","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53092","email":"cpipitone@mac.com","phone":"+14148281033"},{"first_name":"gary","last_name":"mueller","address_1":"11709 north church place","city":"mequon","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53097","email":"garym@bvk.com","phone":"+14148996118"},{"first_name":"alex","last_name":"nikolai","address_1":"1234 east pryor avenue","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53207","email":"alexanderjnikolai@gmail.com","phone":"+14147360969"},{"first_name":"carl","last_name":"bauer","address_1":"4980 saxony lane","city":"greendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53129","email":"cjbesb@gmail.com","phone":"+16302721323"},{"first_name":"carolyn","last_name":"wonders","address_1":"8806 sadler dr.","city":"wind lake","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53185","email":"kk.shopping.receipts@gmail.com"},{"first_name":"carolyn","last_name":"wonders","address_1":"8806 sadler dr.","city":"wind lake","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53185","email":"carolyn@carolynwonders.com"},{"first_name":"cameron","last_name":"swallow","address_1":"623 17th place","city":"kenosha","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53140","email":"cameron.swallow@gmail.com"},{"first_name":"alaina","last_name":"morrison","address_1":"3177 north colonial drive","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53222","email":"a_tron77@hotmail.com"},{"first_name":"jeff","last_name":"godbout","address_1":"po box 674","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53201","email":"jgodbout@brasslightgallery.com"},{"first_name":"brett","last_name":"waterhouse","address_1":"2037 north lake drive","address_2":"12","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53202","email":"brettwaterhouse5@gmail.com"},{"first_name":"adam ryan","last_name":"morris","address_1":"1905 springview court","city":"waukesha","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53186","email":"adam@adamryanmorris.com"},{"first_name":"susan","last_name":"karpfinger","address_1":"1844 north oakland avenue","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53202","email":"sue@circlepictures.tv","phone":"+14142021022"},{"first_name":"albert","last_name":"cunniff","address_1":"10 maple avenue","city":"catonsville","province":"maryland","provincecode":"md","country":"united states","countrycode":"us","zip":"21228","email":"albert.cunniff@gmail.com"},{"first_name":"andrew","last_name":"manikham","address_1":"20190 lower union street","city":"brookfield","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53045","email":"andrewmanikham@gmail.com"},{"first_name":"drake","last_name":"nikolai","address_1":"20190 lower union street","city":"brookfield","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53045","email":"drakejnikolai@gmail.com","phone":"+14145812419"},{"first_name":"samuel","last_name":"molzahn","address_1":"5302 morningside dr","city":"greendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53129","email":"sammolzahn@gmail.com","phone":"+14144052210"},{"country":"united states","countrycode":"us","email":"marissaprovenzalr@gmail.com"},{"first_name":"marissa","last_name":"provenzale","country":"united states","countrycode":"us","email":"marissaprovenzale@gmail.com","phone":"+18479610492"},{"first_name":"aaron","last_name":"toman","address_1":"4116 n. 89th st","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53222","email":"toman.aaron@gmail.com"},{"first_name":"steven","last_name":"hopkins","address_1":"2460 south 30th street","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53215","email":"hopkins8763@sbcglobal.net"},{"first_name":"jim","last_name":"kuse","address_1":"4984 w wabash ave","city":"brown deer","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53223","email":"jkuse25@gmail.com","phone":"+12623646374"},{"first_name":"robin","last_name":"kinney","address_1":"7969 s. main st.","address_2":"203","city":"oak creek","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53154","email":"rkkinney@sbcglobal.net","phone":"4147588699"},{"first_name":"bridget","last_name":"maniaci","address_1":"4460 n oakland ave","address_2":"apt 35","city":"shorewood","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"brmaniaci@gmail.com"},{"first_name":"bridget","last_name":"maniaci","address_1":"4460 n oakland ave","address_2":"apt 35","city":"shorewood","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"shopgoodlqnd@gmail.com","phone":"(608) 516-3488"},{"first_name":"bridget","last_name":"maniaci","address_1":"4460 n oakland ave","city":"shorewood","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"shopgoodland@gmail.com","phone":"+16085163488"},{"first_name":"jack","last_name":"davidson","email":"jackdavidson7@gmail.com"},{"first_name":"josh","last_name":"anderson","address_1":"2900 n menomonee river pkwy","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53222","email":"andersojo@mtmary.edu"},{"first_name":"nancy","last_name":"angelini","address_1":"500 west bender road","city":"glendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53217","email":"4nancyangelini@gmail.com","phone":"+14145102553"},{"first_name":"timothy","last_name":"rozwadowski","email":"trprozwad@gmail.com"},{"first_name":"jack","last_name":"smith","address_1":"495 west water street","city":"princeton","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"54968","email":"jmisc12@protonmail.com"},{"country":"united states","countrycode":"us","email":"skyflyngal@gmail.com"},{"first_name":"david","last_name":"busse","address_1":"520 brookdale ct","city":"south milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53172","email":"david.abusse@yahoo.com"},{"first_name":"charles","last_name":"barrie","address_1":"2480 north oakland avenue","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"ckbarrie@gmail.com","phone":"+12627175119"},{"first_name":"leah","last_name":"schneck","address_1":"6105 north berkeley boulevard","city":"whitefish bay","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53217","email":"lschneck@hansondodge.com"},{"first_name":"chris","last_name":"becker","address_1":"228 w brentwood ln","city":"glendale","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53217","email":"chris.becker@marinecu.com","phone":"+14145318571"},{"first_name":"rome","last_name":"seifert","address_1":"1945 fairhaven boulevard","city":"elm grove","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53122","email":"seifertrm@gmail.com","phone":"+14147914213"},{"first_name":"joseph","last_name":"salvatori","email":"joseph.salvatori@gmail.com"},{"first_name":"paula","last_name":"cull","address_1":"w334n6966 stone bank rd","city":"oconomowoc","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53066","email":"cullplace@aol.com"},{"first_name":"joette","last_name":"rockow","address_1":"3640 w. lakefield drive","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53215","email":"joetterockow@gmail.com","phone":"+14145309212"},{"first_name":"matt","last_name":"o'donnell","address_1":"8847 n mohawk rd","city":"bayside","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53217","email":"mattod1220@gmail.com","phone":"4144058199"},{"first_name":"sherry","last_name":"rox","address_1":"220 honey lake court","city":"north barrington","province":"illinois","provincecode":"il","country":"united states","countrycode":"us","zip":"60010","email":"sherexxx@icloud.com","phone":"+14143122280"},{"first_name":"jean","last_name":"hiller","address_1":"n99w14677 amber dr","city":"germantown","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53022","email":"hillerbri@aol.com"},{"first_name":"patricia","last_name":"m savage","address_1":"space cadets","city":"fox point","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53217","email":"pattiesavage53217@yahoo.com"},{"first_name":"mary","last_name":"hacker","address_1":"1909 n 118th st","city":"wauwatosa","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53226","email":"mary@unitedadworkers.com","phone":"+18479998280"},{"first_name":"dan","last_name":"mclennon","address_1":"2161 south robinson avenue","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53207","email":"danmclennon@gmail.com","phone":"+14145870643"},{"first_name":"lily","last_name":"dempsey","address_1":"790 sterling st s","city":"maplewood","province":"minnesota","provincecode":"mn","country":"united states","countrycode":"us","zip":"55119","email":"lily@pellizziandcompany.com"},{"first_name":"jacqueline","last_name":"wilson","address_1":"2160 s kinnickinnic ave #326","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53207","email":"jacquelinemariewilson@gmail.com","phone":"+14147360261"},{"first_name":"daniel","last_name":"larsen","address_1":"w238n7007 michele ln","city":"sussex","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53089","email":"danlarsen7007@gmail.com","phone":"+12623095190"},{"first_name":"jeff","last_name":"bentoff","address_1":"2628 n. lake dr.","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"jeff@bentoff.com","phone":"+14147911215"},{"first_name":"daniel","last_name":"schnoll","address_1":"3234 n cambridge ave","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"dschnoll@yahoo.com"},{"first_name":"masha","last_name":"velikanov","address_1":"4454 n. morris blvd.","city":"shorewood","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53211","email":"mariavelikanov04@gmail.com","phone":"+14144581655"},{"first_name":"christina","last_name":"ward","address_1":"3826 e pulaski ave","city":"cudahy","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53110-1929","email":"christina@feralhouse.com","phone":"+14143399918"},{"first_name":"andrew","last_name":"wallman","address_1":"205 north street","city":"cambridge","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53523","email":"awallman@me.com","phone":"+16087706581"},{"first_name":"john","last_name":"roberts","address_1":"839 n marshall st","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53202","email":"roberts0120@gmail.com","phone":"+16086928191"},{"first_name":"amy","last_name":"nikolai","email":"anikolai@wi.rr.com"},{"first_name":"cynthia","last_name":"torroll","address_1":"3930 south greenlawn terrace","city":"new berlin","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53151","email":"ctorroll@gmail.com","phone":"+12622716251"},{"first_name":"malcolm","last_name":"woods","email":"malcolmmcdw58@gmail.com"},{"first_name":"michael","last_name":"tunks","email":"morefunintexas@yahoo.com"},{"first_name":"aly","last_name":"miller","address_1":"2835 south ellen street","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53207","email":"alymillr@gmail.com","phone":"+14143135266"},{"first_name":"tarik","last_name":"moody","address_1":"2772 n bremen","city":"milwaukee","province":"wisconsin","provincecode":"wi","country":"united states","countrycode":"us","zip":"53212","email":"tarik@radiomilwaukee.org"},{"first_name":"eliseo","last_name":"carmona","email":"eliseo@brasslightgallery.com"},{"first_name":"jeff","last_name":"sherman","email":"shermanjeff@me.com"}],"referenceKeys":{"first_name":1,"last_name":2,"email":3,"address_1":6,"address_2":7,"city":8,"province":9,"provincecode":10,"country":11,"countrycode":12,"zip":13,"phone":14},"missingKeys":["birthday","ip"],"matchedKeys":{"first_name":"First Name","last_name":"Last Name","email":"Email","address_1":"Address1","address_2": "Address2","city":"City","province":"Province","provincecode":"Province Code","country":"Country","countrycode":"Country Code","zip":"Zip","phone":"Phone"}}

let processing = false;
let modalOpen = false;

let deleteCount = 0;
let copyCount = 0;

/**
 *
 */
const editAction = () => {



	// get dataset


	// return dataset & open modal

	modalOpen = true;


};

/**
 *
 */
const deleteAction = () => {

	if(processing) return;

	if(deleteCount === 0) {

		++deleteCount;

		return;
	}

	console.log("DELETE DATASET");
};

/**
 *
 */
const copyAction = () => {

	if(processing) return;

	if(copyCount === 0) {

		++copyCount;

		return;
	}

	console.log("DUPLICATE DATASET");
};

let date = new Date(dataset.updated_at);
</script>

<article class="border-2 card-dashboard rounded-[var(--border-radius-inner)]">
	<div class="flex items-start justify-between mb-[10px]">
		<h1>Lorem Ipsum Dolor Sit</h1>
	</div>
	<p class="mb-[10px]">Just a short description used to describe this card</p>
	<div class="mb-[10px]">

	</div>
	<div class="mb-[10px] [&>*]:block">
		<!-- TODO: Format this date -->
		<small>Last Updated: {date}</small>
		<small>Records: {EXAMPLE_DATA.structuredData.length}</small>
		<small>Original File Name: filename.csv</small>
	</div>
	<div class="actions flex justify-evenly">
		<div class="w-[30px] h-[30px] tooltip-hover" role="tooltip">
			<Button style={"icon"} type={"button"} on:click={editAction}>
				<EyeIcon size={"20"} strokeWidth={1.5} />
			</Button>
			<Tooltip>
				<p>View Dataset</p>
			</Tooltip>
		</div>
		<!-- TODO: MVP - EDIT ~ TITLE/DESCRIPTION -->
		<div class="w-[30px] h-[30px] tooltip-hover" role="tooltip">
			<Button style={"icon"} type={"button"} on:click={editAction}>
				<EditIcon size={"20"} strokeWidth={1.5} />
			</Button>
			<Tooltip>
				<p>Edit Metainfo</p>
			</Tooltip>
		</div>
		<!-- TODO: MVP - CREATE DATA SLICE -->
		<!--




		-->
		<!-- FUTURE PHASE ~ EDIT & DUPLICATE
		<div class="w-[30px] h-[30px] tooltip-hover" role="tooltip">
			<Button style={"icon"} type={"button"} on:click={editAction}>
				<EditIcon size={"20"} strokeWidth={1.5} />
			</Button>
			<Tooltip>
				<p>Edit Dataset</p>
			</Tooltip>
		</div>
		<div class="w-[30px] h-[30px] tooltip-hover" role="tooltip" on:focusout={() => copyCount = 0} on:mouseleave={() => copyCount = 0}>
			<Button style={"icon"} type={"button"} on:click={copyAction}>
				<CopyIcon size={"20"} strokeWidth={1.5} />
			</Button>
			<Tooltip>
				{#if copyCount > 0}
					<p>Click again to <strong>DUPLICATE</strong> dataset</p>
				{:else}
					<p>Duplicate Dataset</p>
				{/if}
			</Tooltip>
		</div>
		-->
		<!-- FUTURE PHASE ~ UAC "SHARE"
		<div class="w-[30px] h-[30px] tooltip-hover" role="tooltip">
			<Button style={"icon"} type={"button"} on:click={() => {}}>
				<ShareIcon size={"20"} strokeWidth={1.5} />
			</Button>
			<Tooltip>
				<p>Share this Dataset</p>
			</Tooltip>
		</div>
		 -->
		<div class="w-[30px] h-[30px] tooltip-hover" role="tooltip" on:focusout={() => deleteCount = 0} on:mouseleave={() => deleteCount = 0}>
			<Button style={"icon"} type={"button"} on:click={() => deleteAction()}>
				<Trash2Icon size={"20"} strokeWidth={1.5} />
			</Button>
			<Tooltip>
				{#if deleteCount > 0}
					<p>Click again to <strong>DELETE</strong> dataset</p>
					<small>This is a destructive action, and will <strong>delete this dataset permanently</strong>.</small>
				{:else}
					<p>Delete Dataset</p>
				{/if}
			</Tooltip>
		</div>
	</div>
	{#if modalOpen === true}
		<Modal bind:open={modalOpen} overflow={true}>
			<FormDatasetTable dataset={EXAMPLE_DATA} id={dataset._id} />
		</Modal>
	{/if}
</article>