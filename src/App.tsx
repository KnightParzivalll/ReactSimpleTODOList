import { useEffect } from "react";
import {
  Container,
  Button,
  Stack,
  MantineProvider,
  Alert,
  Loader,
  Box,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTasks } from "./hooks/useTasks";
import { useModal } from "./hooks/useModal";

import { TaskFormModal } from "./components/TaskFormModal";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";

export default function App() {
  const {
    tasks,
    loading,
    error,
    setError,
    fetchTodos,
    submitTask,
    deleteTask,
    moveTask,
  } = useTasks();
  const { modal, openNewTaskModal, closeModal, updateFormData, startEdit } =
    useModal();
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <MantineProvider forceColorScheme={theme}>
      <Container size={550} my={40} px="md">
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
            <Box display="flex" style={{ justifyContent: "center" }} py="2rem">
              <Loader />
            </Box>
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
            onClick={openNewTaskModal}
            aria-label="Create new task"
            disabled={loading}
          >
            New Task
          </Button>
        </Stack>

        <TaskFormModal
          opened={modal.isOpen}
          onClose={closeModal}
          formData={modal.formData}
          onChange={updateFormData}
          onSubmit={async () => {
            await submitTask(
              modal.formData,
              modal.isEditing,
              modal.editingTaskId,
            );
            closeModal();
          }}
          isEditing={modal.isEditing}
        />
      </Container>
    </MantineProvider>
  );
}
