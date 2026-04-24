import { useCallback, useState } from "react";
import type { Task, TaskCreate } from "../types/task";
import { todoAPI } from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await todoAPI.getTodos();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const submitTask = useCallback(
    async (
      formData: { title: string; description: string },
      isEditing: boolean,
      editingTaskId: number | null,
    ) => {
      const { title, description } = formData;

      if (!title.trim()) return;

      setError(null);
      const taskData: TaskCreate = { title, description };

      if (isEditing && editingTaskId === null) return;

      if (isEditing && editingTaskId !== null) {
        // Optimistic update
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTaskId ? { ...t, ...taskData } : t)),
        );

        try {
          await todoAPI.updateTodo(editingTaskId, taskData);
        } catch (err) {
          setError("Failed to update task");
          await fetchTodos();
        }

        return;
      }

      const tempId = Math.min(...tasks.map((t) => t.id), 0) - 1;
      const optimisticTask: Task = {
        id: tempId,
        title,
        description,
        order: tasks.length,
      };
      setTasks((prev) => [...prev, optimisticTask]);

      try {
        const created = await todoAPI.createTodo(taskData);
        // Replace temp task with real task
        setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
      } catch (err) {
        setError("Failed to create task");
        await fetchTodos();
      }
    },
    [tasks, fetchTodos],
  );

  const deleteTask = useCallback(
    async (id: number) => {
      setError(null);

      // Optimistic update
      setTasks((prev) => prev.filter((t) => t.id !== id));

      try {
        await todoAPI.deleteTodo(id);
      } catch (err) {
        setError("Failed to delete task");
        await fetchTodos();
      }
    },
    [fetchTodos],
  );

  const moveTask = useCallback(
    async (index: number, dir: "up" | "down") => {
      setError(null);
      const newTasks = [...tasks];
      const target = dir === "up" ? index - 1 : index + 1;

      if (target < 0 || target >= tasks.length) return;

      // Optimistic update
      [newTasks[index], newTasks[target]] = [newTasks[target], newTasks[index]];
      setTasks(newTasks);

      const task = tasks[index];

      try {
        await (dir === "up"
          ? todoAPI.moveUp(task.id)
          : todoAPI.moveDown(task.id));
      } catch (err) {
        setError("Failed to move task");
        await fetchTodos();
      }
    },
    [tasks, fetchTodos],
  );

  return {
    tasks,
    setTasks,
    loading,
    error,
    setError,
    fetchTodos,
    submitTask,
    deleteTask,
    moveTask,
  };
}
