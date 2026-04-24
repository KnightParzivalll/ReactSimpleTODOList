export interface Task {
  id: number;
  title: string;
  description: string;
  order: number;
}

export interface TaskCreate {
  title: string;
  description: string;
}
