import { Page } from "playwright";
import { BasePage } from "../BasePage";
import { expect } from "playwright/test";
import { LoginPage } from "../login-page";
import { qpmnconfig } from "../../../config/envConfig";
import { CartPage } from "../cart";

export class CheckoutPage extends BasePage {

    constructor(public page: Page){
        super(page)
    }

    async openCheckoutPage(): Promise<void> {
        // await this.page.goto( https://www.demo.com/stage/app/check-out/?seqNos=62217975);
        await super.open( );
    }

    async goToCheckoutPageFromCart(){
        const loginpage = new LoginPage(this.page);
        await loginpage.open();
        await loginpage.login(qpmnconfig.credentials.username0, qpmnconfig.credentials.password0);  
        await loginpage.waitForLogin();

        const cartpage = new CartPage(this.page);
        await cartpage.open();
        await this.page.waitForLoadState('networkidle');
        await cartpage.selectItem();
        // await this.page.locator('.cart-content-container').waitFor({state:"visible"});
        // const itemCount = (await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).count())
        // if (itemCount == 0){
        //     console.log("no items in Cart!");
        //     return;
        // }else if (itemCount == 1){
        //     await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).check();
        // }else{
        //     await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).first().check();
        // }
        await this.page.getByRole('button', { name: 'Continue' }).click(); 

    }
    async selectAddress(){
        //select address, default is 2nd one.
        await this.page.locator('form[name="shippingAddressForm"]').getByText('Select Address').click();
        if (this.page.viewportSize()?.width > 767){
            await this.page.locator(`//li[contains(@ng-click, "selectAddress")]`).first().click();
        }else{
            await this.page.locator(`//li[contains(@class,"address-book-item_mobile") and contains(@ng-click, "selectAddress")]`).first().click();
        }

        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async addAddress(){
        await this.page.locator('form[name="shippingAddressForm"]').getByText('Select Address').click();
        await this.page.getByRole('button', { name: ' Add address' }).click();
        await this.page.waitForTimeout(3000);
        await this.page.getByRole('dialog').locator('input[name="firstName"]').fill('first name');
        await this.page.getByRole('dialog').locator('input[name="lastName"]').fill('last name');
        // await this.page.getByRole('dialog').locator('input[name="countryName"]').fill('');
        // await this.page.getByRole('dialog').locator('input[name="countryName"]').fill('United States');
        // await this.page.waitForTimeout(2000);
        // await this.page.getByRole('option', { name: 'United States', exact: true }).getByRole('strong').click();
        await this.page.getByRole('dialog').locator('input[name="stateName"]').click();
        await this.page.waitForTimeout(5000);
        await this.page.getByRole('option', { name: 'Alaska' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('dialog').locator('input[name="cityName"]').fill('city name');
        await this.page.getByRole('dialog').locator('input[name="streetAddress1Name"]').click();
        await this.page.getByRole('dialog').locator('input[name="streetAddress1Name"]').fill('address 1 street');
        await this.page.getByRole('dialog').locator('input[name="streetAddress2Name"]').click();
        await this.page.getByRole('dialog').locator('input[name="streetAddress2Name"]').fill('address 2 street');
        await this.page.getByRole('dialog').locator('input[name="emailAddress"]').click();
        await this.page.getByRole('dialog').locator('input[name="emailAddress"]').fill('email@email.com');
        await this.page.getByRole('button', { name: 'House or Residence ' }).click();
        await this.page.getByRole('menuitem', { name: 'Business' }).click();

        await this.page.locator(`//input[@type="tel" and contains(@class, "mobile-input")]`).first().fill('1122334455');
        await this.page.getByRole('dialog').locator('input[name="telephone"]').fill('123123');

        await this.page.getByRole('dialog').locator('input[name="postalCode"]').fill('200000');

      
        await this.page.locator(`//button[@class="icon-add qp-tags__add-btn ng-scope"]`).first().click();
        await this.page.locator('input[name="inputValue"]').click();
        await this.page.locator('input[name="inputValue"]').pressSequentially('automation1');
        await this.page.waitForTimeout(1000);
        await this.page.locator(`//button[@class="icon-tick add-tag__btn"]`).click();
        await this.page.locator(`//button[@class="icon-add qp-tags__add-btn ng-scope"]`).first().click();
        await this.page.locator('input[name="inputValue"]').click();
        await this.page.locator('input[name="inputValue"]').pressSequentially('automation2');
        await this.page.waitForTimeout(1000);
        await this.page.locator(`//button[@class="icon-tick add-tag__btn"]`).click();
        await this.page.getByLabel('', { exact: true }).check();
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();     
    }

    async editAddress(){
        await this.page.locator('form[name="shippingAddressForm"]').getByText('Select Address').click();
        if (this.page.viewportSize()?.width > 767){
            await this.page.locator('.edit-btn').first().click();
        }else{
            await this.page.locator('.address-book-item_mobile > .edit-btn').first().click();
        }

        await this.page.getByRole('dialog').locator('input[name="firstName"]').fill('updated first name');
        await this.page.getByRole('dialog').locator('input[name="lastName"]').fill('updated last name'); 
        await this.page.getByRole('dialog').locator('input[name="streetAddress1Name"]').fill('updated address 1');
        await this.page.getByRole('button', { name: 'Save' }).click();
        if (this.page.viewportSize()?.width > 767){
            await this.page.locator(`//li[contains(@ng-click, "selectAddress")]`).first().click();
        }
        await this.page.getByRole('button', { name: 'OK' }).click();           
    }

    async selectShippingMethod(){
        //not stable in testing envrionment, shipping method is not always configured.
    
        //US: Express with tracking or Priority Express with tracking
        // await this.page.getByRole('button', { name: 'Express with tracking' }).click();
        // await this.page.waitForTimeout(1000);   
        // await this.page.getByRole('menuitem', { name: 'Priority Express with tracking', exact: true }).click();
        // await this.page.waitForTimeout(1000);    
        // await this.page.getByRole('button', { name: 'Priority Express with tracking' }).click();
        // await this.page.waitForTimeout(1000);   
        // await this.page.getByRole('menuitem', { name: 'Express with tracking', exact: true }).click();
        // await this.page.waitForTimeout(1000);    

        //HK: 
        // await this.page.getByRole('button', { name: 'Self-Pickup (no delivery)' }).click();
        // await this.page.waitForTimeout(1000);    
        // await this.page.getByText('Standard - Registered mail').click();
        // await this.page.waitForTimeout(1000);    
        // await this.page.getByRole('button', { name: 'Standard - Registered mail' }).click();
        // await this.page.waitForTimeout(1000);    
        // await this.page.getByRole('menuitem', { name: 'Express with tracking', exact: true }).click();
        // await this.page.waitForTimeout(1000);    
        // await this.page.getByRole('menuitem', { name: 'Priority Express with tracking', exact: true }).click();
        // await this.page.waitForTimeout(1000);     
        // await this.page.getByRole('menuitem', { name: 'Self-Pickup (no delivery)' }).click();
        // await this.page.waitForTimeout(1000);   

    }

    async reviewAndPayment(){
        await this.page.getByRole('button', { name: 'Review and payment' }).click();
        await this.page.waitForTimeout(5000);    
    }

    async redeemCoupon(coupon: string){

        await this.page.getByRole('textbox').click();
        await this.page.getByRole('textbox').fill(coupon);
        await this.page.getByRole('button', { name: 'Redeem' }).click();
        await this.page.waitForTimeout(2000);
        if(await this.page.locator(`//h2[text()="Invalid coupon code"]`).isVisible({timeout: 30000}) ){
            await this.page.getByRole('button', { name: 'OK' }).click();
        }
        else{
            await expect(this.page.locator('.delete-btn')).toBeVisible({timeout: 30000});
            await this.page.locator('.delete-btn').click();
            await this.page.getByRole('button', { name: 'Sure' }).click();
        }

        // await this.page.getByRole('button', { name: 'confirm and pay' }).click();
        // await this.page.getByRole('button', { name: 'Agree and comply with' }).click();
        // await this.page.waitForTimeout(5000);

    }
}