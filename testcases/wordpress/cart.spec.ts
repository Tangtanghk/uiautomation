// catalog.spec.ts
import { test, expect } from "@playwright/test";
import { CatalogPage } from "../../pages/wordpress/catalog";
import { CartPage } from "../../pages/wordpress/cart";

test.describe("Catalog Page Tests", () => {
  let catalogPage: CatalogPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    cartPage = new CartPage(page);
    await catalogPage.open();
  });

  test("add to cart and view cart", async () => {
    await catalogPage.addToCart();

    await expect(
      catalogPage.page.locator(
        "div.wp-block-woocommerce-filled-mini-cart-contents-block"
      )
    ).toBeVisible();

    await catalogPage.closePopup();

    await catalogPage.viewCart();
  });

  // test("test cart page", async () => {
  //   await catalogPage.addToCart();

  //   await expect(
  //     catalogPage.page.locator(
  //       "div.wp-block-woocommerce-filled-mini-cart-contents-block"
  //     )
  //   ).toBeVisible();

  //   await catalogPage.closePopup();
  //   await catalogPage.viewCart();

  //   await expect(catalogPage.page.locator('h2:has-text("Cart")')).toBeVisible();

  //   const freeShippingMessage = "Free shipping on all orders over $100.";
  //   await expect(
  //     catalogPage.page.locator("text=" + freeShippingMessage)
  //   ).toBeVisible();

  //   await expect(
  //     catalogPage.page.locator(
  //       'a:has-text("Custom Plastic Poker Cards – testing purpose")'
  //     )
  //   ).toBeVisible();

  //   // Check for the subtotal
  //   await expect(catalogPage.page.locator("text=Subtotal")).toBeVisible();
  //   await expect(catalogPage.page.locator("text=$88.00")).toBeVisible();

  //   // Check for the shipping information
  //   await expect(catalogPage.page.locator("text=Free shipping")).toBeVisible();

  //   // Check for the total amount
  //   await expect(catalogPage.page.locator("text=Total")).toBeVisible();
  //   await expect(catalogPage.page.locator("text=$88.00")).toBeVisible();

  //   await expect(
  //     catalogPage.page.locator('a:has-text("Proceed to Checkout")')
  //   ).toBeVisible();

  //   await expect(catalogPage.page.locator("text=Need help?")).toBeVisible();
  //   await expect(catalogPage.page.locator("text=Get in touch")).toBeVisible();
  //   await expect(catalogPage.page.locator("text=Follow us")).toBeVisible();
  //   await expect(
  //     catalogPage.page.locator("text=Subscribe to newsletter")
  //   ).toBeVisible();
  // });
});
