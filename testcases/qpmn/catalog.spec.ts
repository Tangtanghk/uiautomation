import { test, expect } from "@playwright/test";
import { CatalogPage } from "../../pages/qpmn/catalog";

test.describe("Product Page Tests", () => {
  test("Select sort option and validate", async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.open();

    await catalogPage.selectSortOption("New");
    // Add assertions if needed
  });

  test("Search for a product", async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.open();

    await catalogPage.searchProduct("Puzzle");
    expect(
      await catalogPage.isProductVisible("Personalized Jigsaw Puzzle")
    ).toBeTruthy();
  });
});
