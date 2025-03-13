import type { Page } from 'playwright';
import { isVisible } from '../../framework/common-actions';
import { qpmnconfig } from '../../config/envConfig';
import {expect} from "@playwright/test";

export class SearchPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open(): Promise<void> {
        await this.page.goto( qpmnconfig.QPMN_BASEURL + '/app/products/search/?keywords=card');
    }

    async search(keyword: string): Promise<void> {
        await this.page.getByPlaceholder('Search for').fill(keyword);
        await this.page.getByPlaceholder('Search for').press('Enter');
    }
}