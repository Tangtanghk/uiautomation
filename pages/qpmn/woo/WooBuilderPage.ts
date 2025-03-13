import { Page } from "playwright";
import { BasePage } from "../BasePage";
import { expect } from "playwright/test";
import { QpmnBuilderPage } from "../builder/QpmnBuilderPage";
import { locators } from "../builder/builderlocators";
import { wooLocators } from "../builder/woobuilderlocators";

export class WooBuilderPage extends QpmnBuilderPage {

    constructor(public page: Page){
        super(page)
    }

    async openProductDetailPage(): Promise<void> {
        await super.open( );
    }

    async clickOnDesign(){
        await this.page.getByRole('button', { name: 'Design' }).click();
        await expect(this.page.frameLocator(wooLocators.iframe).getByRole('dialog')).toContainText('OK',{timeout: 120000});
        if ( await this.page.frameLocator(wooLocators.iframe).locator(locators.promtconfirm).isVisible({timeout: 10000})){
            await  this.page.frameLocator(wooLocators.iframe).locator(locators.promtconfirm).click();   
        }            
    }
}