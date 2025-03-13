import type { Page } from "playwright";
import { qpmnconfig } from "../../config/envConfig";
import { expect } from "@playwright/test";

export class RegistPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto(qpmnconfig.QPMN_BASEURL + "/app/partner/regist");
    // Assuming there's a button to navigate to the registration form
    await this.page
      .locator("button", { hasText: "Sign up with your email" })
      .click();
  }

  async register(
    nickname: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    await this.page.fill("#userName", nickname);
    await this.page.fill("#userEmail", email);
    await this.page.fill("#userPassword", password);
    await this.page.fill("#confirmPassword", confirmPassword);

    const checkbox = await this.page.getByRole("checkbox", {
      name: "I have read and agree to the",
    });
    await checkbox.check();

    await this.page.click(".regist-form__submit-btn");

    // Wait for the popup to appear and check its content
    const popupMessage = await this.page
      .locator("div#swal2-content")
      .textContent();
    expect(popupMessage).toBe(
      "Your registration mail has been used, please change another mail and try to regist again."
    );

    // Optionally, if you need to close the popup, you can click the OK button
    await this.page.click("button.swal2-confirm");
  }

  // Add more methods as needed for different scenarios
}
