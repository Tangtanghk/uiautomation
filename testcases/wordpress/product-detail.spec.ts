import { test, expect } from "@playwright/test";
import { ProductDetailPage } from "../../pages/wordpress/product-detail";

test.describe("Product Detail Page Tests", () => {
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    productDetailPage = new ProductDetailPage(page);
    await productDetailPage.open(
      "https://chloes.store/product/70-500-pcs-puzzle-horizontal-609-6-x-457-2-mm"
    );
  });

  test("should display the correct product title", async () => {
    const title = await productDetailPage.getProductTitle();
    expect(title).toBe("70 /500 pcs Puzzle | Horizontal 609.6 x 457.2 mm");
  });

  test("should display the correct product price", async () => {
    const price = await productDetailPage.getProductPrice();
    expect(price).toContain("$1,111.99");
  });

  test("should have a product description", async () => {
    const description = await productDetailPage.getProductDescription();
    expect(description).toContain(
      "Our custom 24″” x 18″” puzzle is a great way to capture your favorite memories"
    );
  });
});
