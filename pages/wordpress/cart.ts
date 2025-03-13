import { Page } from "playwright";

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method to check if the cart title is displayed
  async isCartTitleDisplayed() {
    return this.page.isVisible('h2:has-text("Cart")');
  }

  async isProceedToCheckoutButtonPresent() {
    return this.page.isVisible("text=Proceed to Checkout");
  }

  async getSubtotal() {
    return this.page.textContent(
      "div.wp-block-woocommerce-cart-order-summary-subtotal-block .wc-block-components-totals-item__value"
    );
  }

  async getCartItemDetails() {
    return this.page.textContent(".wc-block-cart-item__product");
  }
}
