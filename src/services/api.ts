const API_BASE_URL = "https://faithful-peace-production-595d.up.railway.app";

export interface TodoCreate {
  title: string;
  description: string;
}

export interface TodoOut {
  id: number;
  title: string;
  description: string;
  order: number;
}

class TodoAPI {
  private baseURL = API_BASE_URL;

  async getTodos(): Promise<TodoOut[]> {
    const response = await fetch(`${this.baseURL}/todos/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }
    return response.json();
  }

  async createTodo(data: TodoCreate): Promise<TodoOut> {
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

  async updateTodo(id: number, data: Partial<TodoCreate>): Promise<TodoOut> {
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

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.statusText}`);
    }
  }

  async moveUp(id: number): Promise<TodoOut> {
    const response = await fetch(`${this.baseURL}/todos/${id}/move-up`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Failed to move todo up: ${response.statusText}`);
    }
    return response.json();
  }

  async moveDown(id: number): Promise<TodoOut> {
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
