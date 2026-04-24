import { useEffect, useState } from "react";
import { Container, Stack, MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTasks } from "./hooks/useTasks";
import { useModal } from "./hooks/useModal";

import { TaskFormModal } from "./components/TaskFormModal";
import { Header } from "./components/Header";
import { Settings } from "./pages/Settings";
import { MainPage } from "./pages/MainPage";

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

  const [isSettingsDisabled, setIsSettingsDisabled] = useState<boolean>(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <MantineProvider forceColorScheme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/ReactSimpleTODOList"
            element={
              <Container size={550} my={40} px="md">
                <Stack>
                  <Header
                    theme={theme}
                    toggle={toggleTheme}
                    isSettingsDisabled={isSettingsDisabled}
                  />

                  <MainPage
                    error={error}
                    loading={loading}
                    tasks={tasks}
                    setError={setError}
                    deleteTask={deleteTask}
                    moveTask={moveTask}
                    startEdit={startEdit}
                    openNewTaskModal={openNewTaskModal}
                    fetchTodos={fetchTodos}
                  />
                </Stack>
              </Container>
            }
          />
          <Route
            path="/ReactSimpleTODOList/settings"
            element={
              <Container size={550} my={40} px="md">
                <Stack>
                  <Header
                    theme={theme}
                    toggle={toggleTheme}
                    isSettingsDisabled={isSettingsDisabled}
                  />
                  <Settings
                    tasks={tasks}
                    setIsSettingsDisabled={setIsSettingsDisabled}
                  />
                </Stack>
              </Container>
            }
          />
        </Routes>
      </BrowserRouter>

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
    </MantineProvider>
  );
}
