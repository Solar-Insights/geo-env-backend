/*
1. npx tsx src/manual_scripts/test.ts
*/

import { getCustomerByEmail, getCustomerUpcomingInvoice } from "@/stripe/customers/operations";

const customer = await getCustomerByEmail("mathisbeaudoin15@hotmail.com");
const invoice = await getCustomerUpcomingInvoice(customer);

console.log(invoice.lines.data)