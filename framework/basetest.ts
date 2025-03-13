import { QpmnBuilderPage } from "../pages/qpmn/builder/QpmnBuilderPage";
import { Page, test as baseTest } from "@playwright/test";
import { CheckoutPage } from "../pages/qpmn/checkout/CheckoutPage";
import { WooBuilderPage } from "../pages/qpmn/woo/WooBuilderPage";
import { QpmnMobileBuilderPage } from "../pages/qpmn/builder/QpmnMobileBuilderPage";

// declaring the objects type for autocompletion 
interface PageObjects {
    qpmnbuilderpage: QpmnBuilderPage;
    checkoutpage: CheckoutPage;
    woobuilderpage: WooBuilderPage;
    qpmnmobilebuilderpage: QpmnMobileBuilderPage;
}

// intializing all the page objects you have in your app and import them as fixture in spec file
const test = baseTest.extend<PageObjects>({
    qpmnbuilderpage: async ({ page }, use) => {
        await use(new QpmnBuilderPage(page));
    },

    checkoutpage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    woobuilderpage: async ({ page }, use) => {
        await use(new WooBuilderPage(page));
    },

    qpmnmobilebuilderpage: async ({ page }, use) => {
        await use(new QpmnMobileBuilderPage(page));
    },
});

export default test;
export const expect = test.expect;