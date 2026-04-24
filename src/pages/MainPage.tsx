import { Alert, Box, Button, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { TaskList } from "../components/TaskList";
import { memo, useEffect } from "react";
import type { Task } from "../types/task";
import { useLocation } from "react-router-dom";

type TasksContentProps = {
  error: string | null;
  loading: boolean;
  tasks: Task[];
  setError: (value: string | null) => void;
  deleteTask: (id: number) => Promise<void>;
  moveTask: (id: number, direction: "up" | "down") => void;
  startEdit: (task: Task) => void;
  openNewTaskModal: () => void;
  fetchTodos: () => void;
};

function MainPageComponent({
  error,
  loading,
  tasks,
  setError,
  deleteTask,
  moveTask,
  startEdit,
  openNewTaskModal,
  fetchTodos,
}: TasksContentProps) {
  const location = useLocation();

  // Refetch when returning to main page from settings
  useEffect(() => {
    if (location.pathname === "/ReactSimpleTODOList") {
      fetchTodos();
    }
  }, [location]);

  return (
    <>
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
      >
        + Add Task
      </Button>
    </>
  );
}

export const MainPage = memo(MainPageComponent);
