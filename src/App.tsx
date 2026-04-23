import React from "react";
import {
  Container,
  Button,
  Stack,
  MantineProvider,
  Alert,
  Loader,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Task } from "./types/task";
import { todoAPI } from "./services/api";

import { TaskFormModal } from "./components/TaskFormModal";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [opened, setOpened] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Fetch todos on mount
  React.useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoAPI.getTodos();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  const submitTask = async () => {
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      if (editingTask) {
        await todoAPI.updateTodo(editingTask.id, {
          title,
          description,
        });
        setTasks(
          tasks.map((t) =>
            t.id === editingTask.id ? { ...t, title, description } : t,
          ),
        );
      } else {
        const created = await todoAPI.createTodo({ title, description });
        setTasks([...tasks, created]);
      }

      resetForm();
      setOpened(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setOpened(true);
  };

  const deleteTask = async (id: number) => {
    try {
      setError(null);
      await todoAPI.deleteTodo(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const moveTask = async (index: number, dir: "up" | "down") => {
    try {
      setError(null);
      const newTasks = [...tasks];
      const target = dir === "up" ? index - 1 : index + 1;

      if (target < 0 || target >= tasks.length) return;

      [newTasks[index], newTasks[target]] = [newTasks[target], newTasks[index]];
      setTasks(newTasks);

      const task = tasks[index];
      dir === "up"
        ? await todoAPI.moveUp(task.id)
        : await todoAPI.moveDown(task.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move task");
      await fetchTodos();
    }
  };

  return (
    <MantineProvider forceColorScheme={theme}>
      <Container size={550} my={40}>
        <Stack>
          <Header theme={theme} toggle={toggleTheme} />

          {error && (
            <Alert
              icon={<IconAlertCircle />}
              title="Error"
              color="red"
              withCloseButton
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              <Loader />
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onDelete={deleteTask}
              onMove={moveTask}
              onEdit={startEdit}
            />
          )}

          <Button
            fullWidth
            mt="md"
            onClick={() => setOpened(true)}
            aria-label="Create new task"
            disabled={loading}
          >
            New Task
          </Button>
        </Stack>

        <TaskFormModal
          opened={opened}
          onClose={() => {
            setOpened(false);
            resetForm();
          }}
          title={title}
          description={description}
          setTitle={setTitle}
          setDescription={setDescription}
          onSubmit={submitTask}
          modalTitle={editingTask ? "Edit Task" : "New Task"}
          modalButtonText={editingTask ? "Save Changes" : "Create Task"}
          loading={submitting}
        />
      </Container>
    </MantineProvider>
  );
}
