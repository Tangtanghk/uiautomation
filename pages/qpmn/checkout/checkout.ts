import type { Page } from 'playwright';
import { expect } from 'playwright/test';

export class Checkout {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async checkout(): Promise<void>{

        //select shipping method
        // await this.page.locator('form[name="shippingAddressForm"]').getByText('Select Address').click();
        // await this.page.getByRole('button', { name: 'Cancel' }).click();
        // await this.page.getByRole('button', { name: 'Self-Pickup (no delivery)' }).click();
        // await this.page.getByText('Standard - Registered mail').click();
        // await this.page.getByRole('button', { name: 'Standard - Registered mail' }).click();
        // await this.page.getByRole('menuitem', { name: 'Express with tracking', exact: true }).click();
        // await this.page.getByRole('button', { name: 'Express with tracking' }).click();
        // await this.page.getByRole('menuitem', { name: 'Self-Pickup (no delivery)' }).click();
        
        await this.page.getByRole('button', { name: 'Review and payment' }).click();
        await this.page.waitForTimeout(5000);

        //confirm and pay
        await this.page.getByRole('textbox').click();
        await this.page.getByRole('textbox').fill('invalidcoupon13579');
        await this.page.getByRole('button', { name: 'Redeem' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
        if (this.page.viewportSize()?.width > 767){
            await this.page.getByRole('button', { name: 'confirm and pay' }).click();
        } else{
            await this.page.getByRole('button', { name: 'payment' }).click();
        }

        await this.page.getByRole('button', { name: 'Agree and comply with' }).click();
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('networkidle');
        // await this.page.goto('https://www.sandbox.paypal.com/checkoutnow?token=3F293332D6615030J');
        await this.page.locator(`//input[@name="login_email"]`).click();
        await this.page.locator(`//input[@name="login_email"]`).fill('sb-l2ggk7098211@personal.example.com');
        await this.page.locator(`//button[@id="btnNext"]`).click();
        await this.page.locator(`//input[@id="password"]`).click();
        await this.page.locator(`//input[@id="password"]`).fill('N?7tg>Z#');
        await this.page.locator(`//button[@id="btnLogin"]`).click();
        await this.page.getByTestId('submit-button-initial').click();
        
        await expect(this.page.locator('body')).toContainText('Order Information',{timeout:60000});

    }
}