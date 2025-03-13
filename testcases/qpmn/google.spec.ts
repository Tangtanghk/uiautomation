import { test, expect } from "@playwright/test";
import { qpmnconfig } from '../../config/envConfig';

const userLogin = "vincentlins@qpp.com"; // Replace with your email
const userPass = "qpp@qwer1234"; // Replace with your password

test.describe("Google Login Flow", () => {
  test("Google Login", async ({ page, browser }) => {
    await page.goto(qpmnconfig.QPMN_BASEURL + "/app/partner/login/"); // Replace with your website's login URL

    // Click on the Google login button
    await page.locator("button", { hasText: "Google" }).click();
    
    //Can't login with google account in some regions
    if (await page.getByText('We need to use google service').isVisible()){
      await page.getByRole('button', { name: 'OK' }).click();
      return;
    }
    
    // Handling the new window for Google authentication
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.locator("button", { hasText: "Google" }).click(), // Clicking the button again if it triggers the popup
    ]);

    // Fill in Google credentials in the popup
    await popup.fill('input[type="email"]', userLogin); // Replace with your email
    await popup.getByRole("button", { name: "Next" }).click();

    await popup.fill('input[type="password"]', userPass); // Replace with your password
    await popup.getByRole("button", { name: "Next" }).click();

    await page.waitForURL(
      qpmnconfig.QPMN_BASEURL + "/app/partner/login/"
    );
  });
});
