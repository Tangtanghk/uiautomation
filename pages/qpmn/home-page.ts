import type { Page } from 'playwright';
import { isVisible } from '../../framework/common-actions';

/*
This page is maintained by marketing page, please use catalog page as the 1st page to start your testing
https://www.demo.com/app/customize/new-products/all 
*/

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('https://www.demo.com/');
    }

}
