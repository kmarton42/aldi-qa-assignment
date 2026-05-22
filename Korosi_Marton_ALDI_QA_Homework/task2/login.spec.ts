import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CREDENTIALS } from "../constants";

test.describe("Login tests", () => {
  let loginPage: LoginPage;

  test.beforeEach("GIVEN I am on the login page", async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await test.step("AND I fill out credentials with valid data", async () => {
      await loginPage.fillOutCredentials(
        CREDENTIALS.username,
        CREDENTIALS.password
      );
    });

    await test.step("WHEN I click login", async () => {
      await loginPage.clickLogin();
    });

    await test.step("THEN I should be redirected to the inventory page", async () => {
      await expect(page).toHaveURL(/.*inventory/);
    });
  });

  test("should show error message with invalid password", async ({ page }) => {
    await test.step("AND I fill out credentials with an invalid password", async () => {
      await loginPage.fillOutCredentials(
        CREDENTIALS.username,
        "invalid-password"
      );
    });

    await test.step("WHEN I click login", async () => {
      await loginPage.clickLogin();
    });

    await test.step("THEN an error message should be displayed and the user should stay on the login page", async () => {
      await loginPage.expectInvalidLoginErrorVisible();
      await expect(page).toHaveURL(/.*login/);
    });
  });
});
