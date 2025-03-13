import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/qpmn/cart';
import { LoginPage} from "../../pages/qpmn/login-page";
import * as https from "https";
import exp = require("node:constants");
import { qpmnconfig } from '../../config/envConfig';


test('cartDisplay', async ({ page }) => {
    test.slow();
    //login first
    const loginpage = new LoginPage(page);
    await loginpage.open();
    await loginpage.login(qpmnconfig.credentials.username0, qpmnconfig.credentials.password0);   
    await loginpage.waitForLogin();

    const cartpage = new CartPage(page);
    await cartpage.open();
    await page.waitForLoadState('networkidle');
    let elements: string | any[];
    if (page.viewportSize()?.width > 767){
        await page.locator('.cart-content-container').waitFor({state:"visible"});
        // await page.waitForTimeout(10000);
        elements = await page.$$('.product-box.ng-scope');
    }else{
        await page.locator('.cart-content-container_mobile').waitFor({state:"visible"});
        // await page.waitForTimeout(5000);
        elements = await page.$$('.cart-content-container_mobile [ng-repeat="item in cartCtrl.cartList"]');
    }


    // print the initial values
    console.log(`Starting the loop, no. of elements: ${elements.length}`);
    expect(elements.length).toBeGreaterThan(0);

    //The src of image is loaded asynchronously. When # products is greater than 3, the src may be empty, limited to at most 3.
    const loop = (elements.length<3)?elements.length:3;
    var i = 0;
    for (let element of elements) {
        //expect the tick is not checked   
        let checkbox = await element.$('.checkbox-input.ng-pristine.ng-untouched.ng-valid.ng-empty');
        const isChecked = await checkbox.isChecked();
        expect(isChecked).toBe(false);

        //expect preview image valid
        let img = await element.$('.thumb-small-img.ng-scope');
        if (page.viewportSize()?.width <= 767){
            img = await element.$('.order-item__photo');
        }
        const src = await img.getAttribute('src');
        expect(src.length).toBeGreaterThan(0)
        // https.get(src, (res) => {
        //     expect(res.statusCode).toBe(200);
        // }).on('error', (err) => {
        //     throw err;
        // });

        //expect description not empty
        let description = await element.$('.product-description-container-list');
        if (page.viewportSize()?.width <= 767){
            description = await element.$('.property-desc');
        }
        const textContent = await description.innerText();
        expect(textContent).not.toBe('');

        //expect price change
        // find the unit price and total price elements
        let unitPriceElement = await element.$('.product-item__unit-price span.ng-binding');
        let totalPriceElement = await element.$('.product-item__total-price span.ng-binding');
        if (page.viewportSize()?.width <= 767){
            unitPriceElement = await element.$('.unit-price-content span.ng-binding');
        }

        // find the input element
        let input = await element.$('.icon-edit-pen.input-pen');

        // click on the input element to trigger the modal
        await input.click();

        // fill the input field in the modal with the desired value
        await page.fill('.number-input.ng-pristine.ng-untouched.ng-valid.ng-not-empty', '1');

        // click the OK button in the modal to submit the change
        await page.click('.oK-btn');
        // await expect(page.locator('.loading-box_show').first()).toBeHidden();
        // wait for 3 seconds
        await page.waitForTimeout(3000);

        // get the initial values
        const initialUnitPrice = await unitPriceElement.innerText();
        const initialTotalPrice = await totalPriceElement.innerText();

        // print the initial values
        console.log(`Initial unit price: ${initialUnitPrice}`);
        console.log(`Initial total price: ${initialTotalPrice}`);


        // click on the input element to trigger the modal
        await input.click();

        // fill the input field in the modal with the desired value
        await page.fill('.number-input.ng-pristine.ng-untouched.ng-valid.ng-not-empty', '100');

        // click the OK button in the modal to submit the change
        await page.click('.oK-btn');
        // await expect(page.locator('.loading-box_show').first()).toBeHidden();
        // wait for 3 seconds
        await page.waitForTimeout(3000);

        // get the new values
        const newUnitPrice = await unitPriceElement.innerText();
        const newTotalPrice = await totalPriceElement.innerText();

        // use expect function to assert that the values have changed
        expect(newUnitPrice).not.toBe(initialUnitPrice);
        expect(newTotalPrice).not.toBe(initialTotalPrice);
        i++;
        if (i>=loop){
            break;
        }
    }





});
