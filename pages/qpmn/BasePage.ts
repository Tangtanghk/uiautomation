import { Page } from 'playwright';

export class BasePage {
	path: string;
	
    constructor(public page: Page) {

	}

	async open() {
		if (this.path.length != 0) {
			await this.page.goto(this.path);
			await this.page.waitForLoadState('load');
		} else {
			console.error("invalid URL!")
		}
	}

	async setPath(path: string){
		return this.path = path;
	}
	
	async getUrl() {
		return this.page.url()
	}


	// wait and click the element
	async waitAndClick(Selector: string) {
		await this.page.waitForSelector(Selector)
		return this.page.click(Selector)
	}

	async frameClickAndWait(locator: string) {
		await this.page.frameLocator('iframe[name="builderFrame"]').locator(locator).click();
		await this.page.waitForTimeout(2000);
	}

}
