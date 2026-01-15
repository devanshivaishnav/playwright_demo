Project Demo:  TodoMVC - Make a simple testing structure that covers all the aspects of the website.

1. Setup in VS code:
Open VS Code → Extensions (Ctrl+Shift+X) → install:
Playwright Test for VSCode (by Microsoft)
2. Create Playwright Project (TypeScript):
VScode Terminal/Bash:
mkdir playwright-todomvc
cd playwright-todomvc

VScode Terminal/Bash:
npm init playwright@latest

When prompted choose:
✔ TypeScript
✔ tests
✔ GitHub Actions (yes)
✔ Install browsers (yes)

This creates the following structre:
playwright-todomvc/
├─ tests/
├─ playwright.config.ts
├─ package.json

Sanity check: (Terminal)
npx playwright test


Test cases:
 Positive:
1. Fill and Enter 5 to-do items. *
2. Edit an existing to-do item. *
3. Mark a to-do as completed. *
4. Filter checks.
5. Delete a to-do.
6. Verify persistence after page reload.
Megative:
7. Empty todo submission
8. Extremely long todo text ( Important because it tests input robustness, e.g., overflow.
  // This test will fail everytime because the app does not limit input length.
  // Unreliable behavior may occur. I'd add a character limit for production apps.
  // (Part 4: Intentional failure covered.)) Solution: I'd fix it by adding a character limit check quickly. Less than 25 characters only for items.
9. Special Characters
10. Multiple todos with similar names
11. Rapid delete

Run tests:
npx playwright test --headed
or
npx playwright test --ui

CI config:
GitHub Actions workflow auto-created at .github/workflows/playwright.yml. Runs on every push/PR. VM Spin-up: Ubuntu runner (60min timeout)

What it does:

Installs Node.js + Playwright browsers
Executes npx playwright test
Uploads HTML test report as artifact
Supports Chromium/Firefox/WebKit

Steps:
1. Checkout code ✅ 2s
2. Setup Node 20 ✅ 30s  
3. npm ci (install deps) ✅ 1min
4. npx playwright install --with-deps ✅ 2min
5. npx playwright test ✅ 1-3min (11 tests)
6. Upload report artifact ✅ 10s
Output: Green/red status + HTML report download
