import React, { memo, useCallback, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Divider,
  Group,
  Paper,
  Anchor,
  Alert,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconDownload,
  IconUpload,
  IconTrash,
  IconCheck,
  IconX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";

interface Props {
  tasks: Task[];
  setIsSettingsDisabled: (value: boolean) => void;
}

interface StatusMessage {
  type: "success" | "error" | "info" | null;
  text: string;
}

const initialStatusMessage: StatusMessage = {
  type: null,
  text: "",
};

const alertConfig = {
  success: {
    color: "green",
    icon: <IconCheck size={16} />,
  },
  error: {
    color: "red",
    icon: <IconX size={16} />,
  },
  info: {
    color: "blue",
    icon: <IconInfoCircle size={16} />,
  },
};

function SettingsComponent({ tasks, setIsSettingsDisabled }: Props) {
  const { deleteTask, fetchTodos, submitTask } = useTasks();

  const [statusMessage, setStatusMessage] =
    React.useState<StatusMessage>(initialStatusMessage);

  const setErrorMessage = useCallback((text: string) => {
    setStatusMessage({ type: "error", text });
  }, []);

  const setSuccessMessage = useCallback((text: string) => {
    setStatusMessage({ type: "success", text });
  }, []);

  const setInfoMessage = useCallback((text: string) => {
    setStatusMessage({ type: "info", text });
  }, []);

  const clearStatusMessage = useCallback(() => {
    setStatusMessage(initialStatusMessage);
  }, []);

  // Empty status message after 3 seconds
  useEffect(() => {
    if (statusMessage.type && statusMessage.type !== "info") {
      const timer = setTimeout(() => clearStatusMessage(), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // block back button during operations
  useEffect(() => {
    if (statusMessage.type && statusMessage.type !== "success") {
      setIsSettingsDisabled(true);
    } else {
      setIsSettingsDisabled(false);
    }
  }, [statusMessage]);

  const handleExport = () => {
    if (!tasks?.length) {
      setErrorMessage("No tasks to export");
      return;
    }

    const data = { tasks };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `tasks-export-${new Date().toISOString().slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);

    setSuccessMessage("Tasks exported successfully!");
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setInfoMessage("Importing tasks... Please wait.");

      try {
        const { tasks: importedTasks } = JSON.parse(await file.text());

        if (!Array.isArray(importedTasks)) {
          setErrorMessage("Invalid file format.");
          return;
        }

        // for (const t of tasks) {
        //   await deleteTask(t.id);
        //   await new Promise((res) => setTimeout(res, 250));
        // }

        for (const t of importedTasks) {
          await submitTask(
            { title: t.title, description: t.description || "" },
            false,
            null,
          );
          await new Promise((res) => setTimeout(res, 250));
        }

        await fetchTodos();

        setSuccessMessage("Tasks imported successfully!");
      } catch {
        setErrorMessage("Failed to import tasks.");
      }
    };
    input.click();
  };

  const handleClearAll = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete all tasks? This cannot be undone.",
    );

    if (!confirmed) return;

    setInfoMessage("Clearing all tasks... Please wait.");

    await fetchTodos();

    try {
      await Promise.all(tasks.map((t) => deleteTask(t.id)));
      await fetchTodos();

      setSuccessMessage("All tasks cleared successfully!");
    } catch {
      setErrorMessage("Failed to clear tasks.");
    }
  };

  return (
    <Container size={550} my={0} px="md">
      <Stack gap="xl">
        <Paper shadow="xs" p="md" radius="md">
          <Stack gap="sm">
            <Title order={3}>Data Management</Title>

            {statusMessage.type && (
              <Alert
                color={alertConfig[statusMessage.type].color}
                icon={alertConfig[statusMessage.type].icon}
                withCloseButton
                variant="light"
                onClose={clearStatusMessage}
              >
                {statusMessage.text}
              </Alert>
            )}

            <Group justify="space-between">
              <div>
                <Text fw={500}>Export Tasks</Text>
                <Text size="sm" c="dimmed">
                  Download all tasks as JSON
                </Text>
              </div>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={handleExport}
                variant="light"
              >
                Export
              </Button>
            </Group>

            <Group justify="space-between">
              <div>
                <Text fw={500}>Import Tasks</Text>
                <Text size="sm" c="dimmed">
                  Restore tasks from JSON file
                </Text>
              </div>
              <Button
                leftSection={<IconUpload size={16} />}
                onClick={handleImport}
                variant="light"
              >
                Import
              </Button>
            </Group>

            <Divider my="sm" />

            <Group justify="space-between">
              <div>
                <Text fw={500}>Clear All Tasks</Text>
                <Text size="sm" c="dimmed">
                  Permanently delete all tasks
                </Text>
              </div>
              <Button
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={handleClearAll}
                variant="light"
              >
                Clear All
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="xs" p="md" radius="md">
          <Stack gap="sm">
            <Group>
              <Anchor
                href="https://github.com/knightparzivalll/ReactSimpleTODOList"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="subtle"
                  leftSection={<IconBrandGithub size={16} />}
                >
                  View on GitHub
                </Button>
              </Anchor>
            </Group>

            <Text size="xs" c="dimmed" mt="md">
              © 2026 Built with ❤️ using Mantine + Vite
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export const Settings = memo(SettingsComponent);
