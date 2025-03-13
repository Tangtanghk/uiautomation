import { test, expect } from "@playwright/test";
import { RegistPage } from "../../pages/qpmn/regist-page";

test.describe("Registration Tests", () => {
  test("successful registration", async ({ page }) => {
    const registPage = new RegistPage(page);
    await registPage.open();

    const user = {
      nickname: "testuser",
      useremail1: "testuser@gmail.com",
      userpassword: "Test1234@",
      confirmPassword: "Test1234@",
    };

    await registPage.register(
      user.nickname,
      user.useremail1,
      user.userpassword,
      user.confirmPassword
    );
  });
});
