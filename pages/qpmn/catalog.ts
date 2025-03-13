import type { Page } from "playwright";
import { isVisible } from "../../framework/common-actions";
import { qpmnconfig } from "../../config/envConfig";

export class CatalogPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto(
      qpmnconfig.QPMN_BASEURL + "/app/customize/new-products/all"
    );
  }

  async goToLoginPage(): Promise<void> {
    if (this.page.viewportSize()?.width > 767){
      await this.page.locator('a').filter({ hasText: 'Login' }).click();
    }else{
      await this.page.getByRole('button', { name: '' }).click();
      await this.page.getByRole('button', { name: 'SIGN IN' }).click();           
    }

  }

  async userIsLoggedIn(): Promise<boolean> {
    return await isVisible(
      this.page,
      ".user-info__menu > .btn-icon-chervon-down"
    );
  }

  async userIsLoggedOut(): Promise<boolean> {
    return await isVisible(this.page, ".login-regist-box > .login-box");
  }

  async signout(): Promise<void> {
    await this.page
      .locator(".user-info__menu > .btn-icon-chervon-down")
      .click();
    await this.page.getByText("Sign Out").click();
  }

  async selectSortOption(sortOption: string) {
    // Click to open the dropdown
    if (this.page.viewportSize()?.width > 767){
      await this.page.click(".products-stort-menu-box");
    }else{
      await this.page.click(".sort-icon");
    }
    
    await this.page.waitForTimeout(2000);

    const selector = await this.page.locator("#sortBox").getByText("New");
    await selector.click({timeout:5000});

    await this.page.waitForTimeout(2000);

    await this.page.waitForSelector(".dropdown-menu-list", {
      state: "hidden",
    });

    await this.page.waitForTimeout(2000);
  }

  async searchProduct(keyword: string) {
    await this.page.fill(".search-input", keyword);
    await this.page.click(".btn-icon-search");
    await this.page.waitForTimeout(3000);
  }

  async isProductVisible(productName: string) {
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState('networkidle');
    return await this.page.isVisible(
      `.product__name:has-text("${productName}")`
    );
  }
}
