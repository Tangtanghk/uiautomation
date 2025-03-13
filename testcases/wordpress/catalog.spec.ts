import { test, expect } from "@playwright/test";
import { CatalogPage } from "../../pages/wordpress/catalog";

test.describe("E-commerce Product Listing Page Tests", () => {
  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    await catalogPage.open();
  });

  test("should load the product listing page correctly", async () => {
    const pageTitle = await catalogPage.page.title();
    expect(pageTitle).toContain("Shop");
  });

  test("should display product titles and prices", async () => {
    const productTitles = await catalogPage.page
      .locator("h3.wp-block-post-title")
      .allTextContents();
    expect(productTitles.length).toBeGreaterThan(0);

    const productPrices = await catalogPage.page
      .locator("div.wp-block-woocommerce-product-price")
      .allTextContents();
    expect(productPrices.length).toBeGreaterThan(0);
  });
});
