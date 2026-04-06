import React from "react";
import { Container, Button, Stack, MantineProvider } from "@mantine/core";

import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Task } from "./types/task";

import { TaskFormModal } from "./components/TaskFormModal";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("TODO_tasks", []);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [opened, setOpened] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  const submitTask = () => {
    if (!title.trim()) return;

    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id ? { ...t, title, description } : t,
        ),
      );
    } else {
      setTasks([...tasks, { id: Date.now().toString(), title, description }]);
    }

    resetForm();
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setOpened(true);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const moveTask = (index: number, dir: "up" | "down") => {
    const newTasks = [...tasks];
    const target = dir === "up" ? index - 1 : index + 1;

    if (target < 0 || target >= tasks.length) return;

    [newTasks[index], newTasks[target]] = [newTasks[target], newTasks[index]];

    setTasks(newTasks);
  };

  return (
    <MantineProvider forceColorScheme={theme}>
      <Container size={550} my={40}>
        <Stack>
          <Header theme={theme} toggle={toggleTheme} />

          <TaskList
            tasks={tasks}
            onDelete={deleteTask}
            onMove={moveTask}
            onEdit={startEdit}
          />

          <Button
            fullWidth
            mt="md"
            onClick={() => setOpened(true)}
            aria-label="Create new task"
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
        />
      </Container>
    </MantineProvider>
  );
}
