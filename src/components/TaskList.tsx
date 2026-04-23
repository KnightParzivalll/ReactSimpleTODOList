import { Stack } from "@mantine/core";
import { TaskCard } from "./TaskCard";
import type { Task } from "../types/task";

interface Props {
  tasks: Task[];
  onDelete: (id: number) => void;
  onMove: (index: number, dir: "up" | "down") => void;
  onEdit: (task: Task) => void;
}

export function TaskList({ tasks, onDelete, onMove, onEdit }: Props) {
  return (
    <Stack>
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          tasksLength={tasks.length}
          onDelete={onDelete}
          onMove={onMove}
          onEdit={onEdit}
        />
      ))}
    </Stack>
  );
}
