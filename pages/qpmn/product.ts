import type { Page } from 'playwright';
import { isVisible } from '../../framework/common-actions';
import { qpmnconfig } from '../../config/envConfig';
import {expect} from "@playwright/test";

export class ProductPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open(): Promise<void> {
        await this.page.goto( qpmnconfig.QPMN_BASEURL + '/app/products/large-size-custom-playing-card-standard/');
    }

}