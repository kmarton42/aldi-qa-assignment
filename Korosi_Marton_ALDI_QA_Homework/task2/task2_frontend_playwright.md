# Task 2: Frontend Testing

For end-to-end testing I would use Playwright with TypeScript.

## Setup steps

```bash
npm init playwright@latest
npx playwright test
npx playwright show-report
```

The application URL would be configured in `playwright.config.ts`:

```ts
use: {
  baseURL: 'https://example-app-url.com',
}
```

## Test implementation

The sample login test implementation is provided in:

* `login.spec.ts`
* `LoginPage.ts`

The tests cover successful login with valid credentials and error handling for invalid password.
