import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test.describe('TodoMVC Demo - User Stories & Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    test.info().annotations.push({ type: 'info', description: 'Navigated to TodoMVC Demo' });
  });

  test('1. Add 5 todo items', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const items = ['1. Milk', '2. Bread', '3. Eggs', '4. Cheese', '5. Apples'];
    for (const item of items) await todoPage.addTodo(item);
    await expect(todoPage.todoItems).toHaveCount(5);
  });

  test('2. Edit an existing todo item', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('3. Eggs');
    await todoPage.editTodo(0, '3. Yogurt');
    await expect(page.locator('label:has-text("3. Yogurt")')).toBeVisible();
  });

  test('3. Mark a todo as completed', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('1. Milk');
    await todoPage.completeTodo(0);
    await todoPage.filter('Completed');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('4. Filter checks', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const items = ['1. Milk', '2. Bread', '3. Eggs', '4. Cheese'];
    for (const item of items) await todoPage.addTodo(item);
    await todoPage.completeTodo(0); // Complete first
    await todoPage.filter('Active');
    await expect(todoPage.todoItems).toHaveCount(3);
    await todoPage.filter('Completed');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('5. Delete a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('5. Apples');
    await todoPage.deleteTodo(0);
    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('6. Verify persistence after page reload', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const expected = ['2. Bread', '3. Yogurt', '4. Cheese'];
    for (const item of expected) await todoPage.addTodo(item);
    await page.reload();
    await todoPage.verifyTodos(expected);
  });

  test('7. Negative: Empty todo submission', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const countBefore = await todoPage.todoItems.count();
    await todoPage.addTodo('');
    await expect(todoPage.todoItems).toHaveCount(countBefore);
  });

  // This test will fail everytime because the app does not limit input length.
  // Unreliable behavior may occur. I'd add a character limit for production apps.
  // Solution: I'd fix it by adding a character limit check quickly. Less than 25 characters only for items.
  test('8. Negative: Extremely long todo text', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const veryLong = 'Item'.repeat(50);
    const countBefore = await todoPage.todoItems.count();
    await todoPage.addTodo(veryLong);
    await expect(todoPage.todoItems).toHaveCount(countBefore + 1);
  });

  test('9. Special characters', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('Buy @#$% &*() Milk!');
    await expect(page.locator('label:has-text("@#$%")')).toBeVisible();
  });

  test('10. Multiple todos with similar names', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('4. Cheese');
    await todoPage.addTodo('4. Cheese');
    const totalCount = await page.locator('label:has-text("4. Cheese")').count();
    expect(totalCount).toBeGreaterThan(1);
  });

  test('11. Rapid delete', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const items = ['1', '2', '3', '4'];
    for (const item of items) await todoPage.addTodo(item);
    const startCount = await todoPage.todoItems.count();
    for (let i = 0; i < 3; i++) await todoPage.deleteTodo(0);
    await expect(todoPage.todoItems).toHaveCount(startCount - 3);
  });

});
