import type { Task, TaskCreate } from "../types/task";

const API_BASE_URL = "https://faithful-peace-production-595d.up.railway.app";

class TodoAPI {
  private baseURL = API_BASE_URL;

  /**
   * Fetch all todos from the API
   * @returns Promise<Task[]> - Array of all todos
   */
  async getTodos(): Promise<Task[]> {
    const response = await fetch(`${this.baseURL}/todos/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Create a new todo
   * @param data - TaskCreate object with title and description
   * @returns Promise<Task> - The created todo with id and order
   */
  async createTodo(data: TaskCreate): Promise<Task> {
    const response = await fetch(`${this.baseURL}/todos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Update an existing todo
   * @param id - Todo ID to update
   * @param data - Partial TaskCreate object (title and/or description)
   * @returns Promise<Task> - The updated todo
   */
  async updateTodo(id: number, data: Partial<TaskCreate>): Promise<Task> {
    const response = await fetch(`${this.baseURL}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Delete a todo
   * @param id - Todo ID to delete
   * @returns Promise<void>
   */
  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.statusText}`);
    }
  }

  /**
   * Move a todo up in the list (decrease order)
   * @param id - Todo ID to move up
   * @returns Promise<Task> - The updated todo
   */
  async moveUp(id: number): Promise<Task> {
    const response = await fetch(`${this.baseURL}/todos/${id}/move-up`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Failed to move todo up: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Move a todo down in the list (increase order)
   * @param id - Todo ID to move down
   * @returns Promise<Task> - The updated todo
   */
  async moveDown(id: number): Promise<Task> {
    const response = await fetch(`${this.baseURL}/todos/${id}/move-down`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Failed to move todo down: ${response.statusText}`);
    }
    return response.json();
  }
}

export const todoAPI = new TodoAPI();
