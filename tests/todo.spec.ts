import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/Todopage';

test('TodoMVC User Story - Complete Flow', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  console.log('TodoMVC Demo Started');

  // ============================================================================
  // 1. ADD 5 ITEMS
  // ============================================================================
  console.log('1. ADDING 5 ITEMS');
  const items = ['1. Milk', '2. Bread', '3. Eggs', '4. Cheese', '5. Apples'];
  for (let item of items) {
    await todoPage.addTodo(item);
  }
  await expect(todoPage.todoItems).toHaveCount(5);
  console.log('1. PASS: 5 items added');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 2. EDIT ITEM #3
  // ============================================================================
  console.log('2. EDIT #3 → Yogurt');
  await todoPage.editTodo(2, '3. Yogurt');
  await expect(page.locator('label:has-text("3. Yogurt")')).toBeVisible();
  console.log('2. PASS: Edit works');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 3. COMPLETE #1 → COMPLETED FILTER
  // ============================================================================
  console.log('3. COMPLETE #1 → COMPLETED');
  await todoPage.completeTodo(0);
  await todoPage.completedfilter('Completed');
  await expect(todoPage.todoItems).toHaveCount(1);
  console.log('3. PASS: 1 completed');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 4. ACTIVE FILTER (4 items left)
  // ============================================================================
  console.log('4. ACTIVE FILTER');
  await todoPage.activefilter('Active');
  await expect(todoPage.todoItems).toHaveCount(4);
  console.log('4. PASS: 4 active items');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 5. DELETE ITEM #2
  // ============================================================================
  await todoPage.deleteTodo(3);  // Deletes '5. Apples'
  await expect(todoPage.todoItems).toHaveCount(3);
  await expect(page.locator('label:has-text("5. Apples")')).not.toBeVisible();
  console.log('5. PASS: Apples deleted');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 6. PERSISTENCE (All remaining visible)
  // ============================================================================
  console.log('6. PERSISTENCE');
  await page.reload();
  const expected = ['2. Bread', '3. Yogurt', '4. Cheese'];
  for (let item of expected) {
    await expect(page.locator(`label:has-text("${item}")`)).toBeVisible();
  }
  console.log('6. PASS: 3 items persist');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 7. NEGATIVE: EMPTY INPUT
  // ============================================================================
  console.log('7. EMPTY INPUT');
  const countBeforeEmpty = await todoPage.todoItems.count();
  await todoPage.addTodo('');
  await expect(todoPage.todoItems).toHaveCount(countBeforeEmpty);
  console.log('7. PASS: Empty ignored');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 8. NO CHARACTER LIMIT
  // ============================================================================
  console.log('8. LONG TEXT');
  const veryLong = 'Item'.repeat(50);
  const countBeforeLong = await todoPage.todoItems.count();
  await todoPage.addTodo(veryLong);
  await expect(todoPage.todoItems).toHaveCount(countBeforeLong + 1);
  console.log('8. PASS: Long text works');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 9. SPECIAL CHARACTERS
  // ============================================================================
  console.log('9. SPECIAL CHARS');
  await todoPage.addTodo('Buy @#$% &*() Milk!');
  await expect(page.locator('label:has-text("@#$%")')).toBeVisible();
  console.log('9. PASS: Special chars work');
  await page.waitForTimeout(2000);

  // ============================================================================
  // 10. ADD SAME ITEM AGAIN
  // ============================================================================
  console.log('10. DUPLICATE ITEM');
  await todoPage.addTodo('4. Cheese');
  const totalCount = await page.locator('label:has-text("4. Cheese")').count();
  expect(totalCount).toBeGreaterThan(1);  // 2+ ✓
  console.log(`10. PASS: ${totalCount} "4. Cheese" items`);
  await page.waitForTimeout(2000);

  // ============================================================================
  // 11. RAPID DELETE
  // ============================================================================
  console.log('11. RAPID DELETE');
  const startCount = await todoPage.todoItems.count();
  for (let i = 0; i < 3; i++) {
    await todoPage.deleteTodo(0);
  }
  await expect(todoPage.todoItems).toHaveCount(startCount - 3);
  console.log('11. PASS: Rapid delete works');
  console.log('\nALL 11 TESTS PASSED');
  console.log('Report: http://localhost:9323');
});
