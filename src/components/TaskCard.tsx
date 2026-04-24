import { memo } from "react";
import { Card, Text, Group, ActionIcon, Box } from "@mantine/core";
import {
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconEdit,
} from "@tabler/icons-react";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  index: number;
  tasksLength: number;
  onDelete: (id: number) => void;
  onMove: (index: number, dir: "up" | "down") => void;
  onEdit: (task: Task) => void;
}

function TaskCardComponent({
  task,
  index,
  tasksLength,
  onDelete,
  onMove,
  onEdit,
}: Props) {
  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start">
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600} truncate>
            {task.title}
          </Text>
          <Text size="sm" c="dimmed" truncate>
            {task.description || "No summary"}
          </Text>
        </Box>

        <Group gap={4}>
          <ActionIcon
            onClick={() => onMove(index, "up")}
            disabled={index === 0}
            aria-label="Move task up"
          >
            <IconArrowUp size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={() => onMove(index, "down")}
            disabled={index === tasksLength - 1}
            aria-label="Move task down"
          >
            <IconArrowDown size={16} />
          </ActionIcon>
          <ActionIcon onClick={() => onEdit(task)} aria-label="Edit task">
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            color="red"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}

export const TaskCard = memo(TaskCardComponent);
