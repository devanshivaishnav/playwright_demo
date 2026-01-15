import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly todoInput: Locator;
  readonly todoItems: Locator;
  readonly toggle: Locator;
  readonly filterLinks: Locator;

  constructor(page: Page) {
  this.page = page;
  this.todoInput = page.locator('input.new-todo');  // ← CSS class (real selector)
  this.todoItems = page.locator('ul.todo-list li');
  this.toggle = this.todoItems.locator('input.toggle');
  this.filterLinks = page.locator('.filters a');
}

  async goto() {
    await this.page.goto('/todomvc/');
  }

  async addTodo(text: string) {
  await this.page.waitForSelector('input.new-todo', { state: 'visible' });
  await this.todoInput.fill(text);
  await this.todoInput.press('Enter');
}

  async completeTodo(index: number = 0) {
  // Marks the todo at 'index' as completed
    await this.toggle.nth(index).click();
  }

  async editTodo(index: number, newText: string) {
  // 1. Double-click to enter edit
  await this.todoItems.nth(index).locator('label').dblclick();
  
  // 2. Wait for edit input (critical!)
  await this.page.locator('li.editing input.edit').first().waitFor({ state: 'visible', timeout: 5000 });
  
  // 3. Clear + type (reliable)
  const editBox = this.page.locator('li.editing input.edit').first();
  await editBox.clear();  // Backspace all
  await editBox.type(newText, { delay: 100 });  // Type slowly
  await editBox.press('Enter');
}

  async deleteTodo(index: number) {
    await this.todoItems.nth(index).hover();
    await this.todoItems.nth(index).locator('button').click();
  }

  async activefilter(filter: 'Active' ) {
  await this.filterLinks.getByText(filter).first().click();
}
 async completedfilter(filter: 'Completed' ) {
  await this.filterLinks.getByText(filter).first().click();
}

async filter(filterName: 'All' | 'Active' | 'Completed') {
    await this.filterLinks.getByText(filterName).first().click();
  }

async verifyActiveCompletedAndClean(expectedActive: string[], expectedCompleted: string[]) {
    await this.filter('Active');  // ← Uses filter method
    await expect(this.todoItems.locator('[data-testid="todo-title"]')).toHaveText(expectedActive);
    
    await this.filter('Completed');  // ← Uses filter method
    await expect(this.todoItems.locator('[data-testid="todo-title"]')).toHaveText(expectedCompleted);
    
    const count = await this.todoItems.count();
    for (let i = 0; i < count; i++) {
      await this.toggle.nth(i).click();
    }
    
    await this.filter('All');  // ← Uses filter method
  }

}
