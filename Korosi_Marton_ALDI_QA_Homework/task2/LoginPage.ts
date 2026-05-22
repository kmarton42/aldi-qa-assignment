import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');

    this.errorMessage = page.getByText(
      "Username and password do not match"
    );
  }

  async open() {
    await this.page.goto("/login");
  }

  async fillOutCredentials(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async expectInvalidLoginErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }
}
