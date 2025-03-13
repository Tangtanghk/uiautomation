// product-detail.ts
import { Page } from "playwright";

export class ProductDetailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(url: string) {
    await this.page.goto(url);
  }

  async getProductTitle() {
    return this.page.textContent("h1.wp-block-post-title");
  }

  async getProductPrice() {
    return this.page.textContent("div.wp-block-woocommerce-product-price");
  }

  async getProductDescription() {
    return this.page.textContent("div.woocommerce-Tabs-panel--description");
  }

  async clickAddToCart() {
    await this.page.click("button.single_add_to_cart_button");
  }
}
