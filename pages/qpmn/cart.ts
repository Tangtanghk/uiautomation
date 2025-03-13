import type { Page } from 'playwright';
import { isVisible } from '../../framework/common-actions';
import { qpmnconfig } from '../../config/envConfig';
import {expect} from "@playwright/test";

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open(): Promise<void> {
        await this.page.goto( qpmnconfig.QPMN_BASEURL + '/app/cart/');
    }

    async selectItem(): Promise<void>{
        //select 1st product to checkout
        if (this.page.viewportSize()?.width > 767){
            await this.page.locator('.cart-content-container').waitFor({state:"visible"});
            const itemCount = (await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).count())
            if (itemCount == 0){
                console.log("no items in Cart!");
                return;
            }else if (itemCount == 1){
                await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).check();
            }else{
                await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).first().check();
            }
            } else{
                await this.page.locator('.cart-content-container_mobile').waitFor({state:"visible"});
                const itemCount = (await this.page.locator(`//div[@class="cart-content-container_mobile ng-scope"]//input[@id="item.id"]`).count())
                if (itemCount == 0){
                    console.log("no items in Cart!");
                    return;
                }else if (itemCount == 1){
                    await this.page.locator(`//div[@class="cart-content-container_mobile ng-scope"]//input[@id="item.id"]`).check();
                }else{
                    await this.page.locator(`//div[@class="cart-content-container_mobile ng-scope"]//input[@id="item.id"]`).first().check();
                }            
            }
    }
}