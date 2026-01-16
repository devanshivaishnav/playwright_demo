import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly todoInput: Locator;
  readonly todoItems: Locator;
  readonly filterLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoInput = page.locator('input.new-todo');
    this.todoItems = page.locator('ul.todo-list li');
    this.filterLinks = page.locator('.filters a');
  }

  async goto() {
    await this.page.goto('/todomvc/');
    await expect(this.todoInput).toBeVisible();
  }

  async addTodo(text: string) {
    if (!text.trim()) return; // ignore empty input
    await this.todoInput.fill(text);
    await this.todoInput.press('Enter');
  }

  async completeTodo(index: number = 0) {
    await this.todoItems.nth(index).locator('input.toggle').click();
  }

  async editTodo(index: number, newText: string) {
    const todo = this.todoItems.nth(index);
    await todo.locator('label').dblclick();
    const editBox = todo.locator('input.edit');
    await expect(editBox).toBeVisible();
    await editBox.fill(newText);
    await editBox.press('Enter');
  }

  async deleteTodo(index: number) {
    const todo = this.todoItems.nth(index);
    await todo.hover();
    await todo.locator('button.destroy').click();
  }

  async filter(filterName: 'All' | 'Active' | 'Completed') {
    await this.filterLinks.getByText(filterName).click();
  }

  async verifyTodos(expected: string[]) {
    const labels = this.todoItems.locator('label');
    await expect(labels).toHaveText(expected);
  }
}