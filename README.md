# Playwright TodoMVC Tests

This repository contains **Playwright tests** for the [TodoMVC demo](https://demo.playwright.dev/todomvc) application.

---

## Features

- Adds multiple todo items
- Edit, complete, delete todos
- Filters: All / Active / Completed
- Persistence check after reload
- Negative & edge cases:
  - Empty input
  - Long text input
  - Special characters
  - Duplicate items
  - Rapid delete
  
## Why baseURL + relative paths?
baseURL: 'https://demo.playwright.dev' + goto('/todomvc/') = full URL automatically.
Keeps tests clean, maintainable, and follows Playwright best practices.

### Note to Fix: Limit Long Todo Input

To prevent extremely long todo items from breaking the UI, update the `addTodo` method in `todo.page.ts` as follows:

```ts
async addTodo(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return; // Ignore empty input

  // Limit input to 25 characters
  const finalText = trimmed.length > 25 ? trimmed.slice(0, 25) : trimmed;

  await this.todoInput.fill(finalText);
  await this.todoInput.press('Enter');
}

---

## Setup

1. Clone repo:

Terminal/bash:
git clone <repo-url>
cd <repo-folder>

2. Install dependencies:
npm ci
npx playwright install --with-deps


3. Create Playwright Project (TypeScript): 
VScode Terminal/Bash: 
mkdir playwright-todomvc 
cd playwright-todomvc
npm init playwright@latest

4. Run tests:
npx playwright test

5. Show report:
npx playwright show-report

6. CI/CD with github actions:

## CI/CD with GitHub Actions

This project is configured to automatically run Playwright tests using **GitHub Actions** on every push or pull request to `main` or `master`.

### Workflow Steps

1. **Checkout Code**
   - The workflow pulls your latest code using `actions/checkout`.

2. **Setup Node**
   - Installs Node.js (latest LTS) using `actions/setup-node`.

3. **Install Dependencies**
   - Installs all npm dependencies reproducibly via `npm ci`.

4. **Install Playwright Browsers**
   - Installs Chromium, Firefox, and WebKit along with OS dependencies.

5. **Run Tests**
   - Executes Playwright tests using `npx playwright test`.

6. **Upload Test Report**
   - Uploads the Playwright HTML report to GitHub Actions artifacts.
   - The report is retained for 30 days and can be downloaded directly from the workflow run.

### How to Access Reports

1. Go to the GitHub Actions tab.
2. Open the latest workflow run.
3. Look for **Artifacts → playwright-report**.
4. Download and open `index.html` in a browser to see detailed test results.

### Notes

- This workflow is simple and only runs **one job on Ubuntu**.
- You can extend it later to test **multiple browsers**, run **parallel jobs**, or **upload traces** for debugging flaky tests.
- The workflow ensures that tests **fail the CI job if any test fails**, helping catch bugs early.


