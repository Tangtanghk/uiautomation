import { Page } from "playwright";

export class CatalogPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto("https://chloes.store/shop"); // Replace with the actual URL
  }

  async addToCart() {
    await this.page
      .locator("button", { hasText: "Add to cart" })
      .first()
      .click();
  }

  async closePopup() {
    await this.page.waitForLoadState("networkidle");
    await this.page.click("button.wc-block-components-drawer__close");
  }

  async viewCartFromPopup() {
    await this.page.locator("a", { hasText: "View cart" }).first().click();
  }

  async viewCart() {
    await this.page.waitForLoadState("networkidle");
    await this.page.click(
      'a[href="https://chloes.store/cart/"]:has-text("View cart")'
    );
    await this.page.waitForTimeout(3000);
  }

  async areProductTitlesVisible() {
    return this.page.isVisible("h3.wp-block-post-title");
  }

  async areProductPricesVisible() {
    return this.page.isVisible("div.wp-block-woocommerce-product-price");
  }

  async addToCartFirstProduct() {
    await this.page.click("button.add_to_cart_button:first-of-type");
  }

  async selectSortOption(optionValue: string) {
    await this.page.selectOption("select.orderby", optionValue);
  }
}
