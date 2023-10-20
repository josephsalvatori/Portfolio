import { fail, redirect } from "@sveltejs/kit";
import { Api } from "$api";
import parsePhoneNumber from "libphonenumber-js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ request, url }) {

	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async({ cookies, fetch, locals, request, url }) => {

		/**
		 * Update user settings
		 */
		let returnObj = {};
		let logout = false;

		// Defaults
		let data = await request.formData();
		let firstName = data.get("first_name");
		let lastName = data.get("last_name");
		let marketingOptIn = data.get("accepts_marketing");
		let phone = data.get("phone");
		let password = data.get("new_password");
		let confirmPassword = data.get("confirm_password");
		let token = data.get("token");

		let callType = "customerUpdate";
		let callFormat = "$customer: CustomerUpdateInput!, $customerAccessToken: String!";
		let callInput = `${callType}(customer: $customer, customerAccessToken: $customerAccessToken)`;
		let variables = {
			customer: {
				firstName: firstName,
				lastName: lastName,
				acceptsMarketing: (marketingOptIn) ? true : false
			},
			customerAccessToken: token
		};

		// check phone
		if(phone) {

			let phoneObject = parsePhoneNumber(phone, "US");

			if(phoneObject?.number) variables.customer.phone = phoneObject.format("E.164");
		}

		if(password && password === confirmPassword) {
			logout = true;
			variables.customer.password = password;
		}

		console.log(variables);
		let query = `mutation ${callType}(${callFormat}) {
			${callInput} {
				customer {
					acceptsMarketing
					addresses(first: 10) {
						edges {
							node {
								address1
								address2
								city
								company
								countryCodeV2
								firstName
								formatted
								formattedArea
								id
								lastName
								latitude
								longitude
								name
								phone
								province
								provinceCode
								zip
							}
						}
					}
					createdAt
					defaultAddress {
						address1
						address2
						city
						company
						countryCodeV2
						firstName
						formatted
						formattedArea
						id
						lastName
						latitude
						longitude
						name
						phone
						province
						provinceCode
						zip
					}
					displayName
					email
					firstName
					id
					lastIncompleteCheckout {
						completedAt
						createdAt
						id
						paymentDue {
							amount
						}
						ready
						totalPrice {
							amount
						}
						updatedAt
						webUrl
					}
					lastName
					numberOfOrders
					orders(first: 50) {
						edges {
							node {
								billingAddress {
									id
								}
								cancelReason
								canceledAt
								currencyCode
								currentSubtotalPrice {
									amount
								}
								currentTotalDuties {
									amount
								}
								currentTotalPrice {
									amount
								}
								currentTotalTax {
									amount
								}
								customAttributes {
									key
									value
								}
								customerLocale
								customerUrl
								edited
								email
								financialStatus
								fulfillmentStatus
								id
								name
								orderNumber
								originalTotalDuties {
									amount
								}
								originalTotalPrice {
									amount
								}
								phone
								processedAt
								shippingAddress {
									id
								}
								shippingDiscountAllocations {
									allocatedAmount {
										amount
									}
									discountApplication {
										allocationMethod
										targetSelection
										targetType
										value
									}
								}
								statusUrl
								subtotalPrice {
									amount
								}
								successfulFulfillments(first: 3) {
									trackingCompany
									trackingInfo(first: 3) {
										number
										url
									}
								}
								totalPrice {
									amount
								}
								totalRefunded {
									amount
								}
								totalShippingPrice {
									amount
								}
								totalTax {
									amount
								}
							}
						}
					}
					phone
					tags
					updatedAt
				}
				customerAccessToken {
					accessToken
					expiresAt
				}
				customerUserErrors {
					code
					field
					message
				}
			}
		}`;

		let shopRequest = await Api.Storefront.client({ fetch, query, variables });

		// Fail
		if(shopRequest?.data[callType]?.customerUserErrors[0]) {

			returnObj.errors = shopRequest.data[callType].customerUserErrors;

			return fail(401, returnObj);
		}

		if(shopRequest?.data[callType]?.customer?.id) {
			returnObj.customer = shopRequest.data[callType].customer;
		}

		return returnObj;
	}
};