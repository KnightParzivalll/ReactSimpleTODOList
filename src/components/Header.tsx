import { Title, Group } from "@mantine/core";
import { ThemeToggle } from "./ThemeToggle";

export function Header({
  theme,
  toggle,
}: {
  theme: "light" | "dark";
  toggle: () => void;
}) {
  return (
    <Group justify="space-between">
      <Title fw={900}>My Tasks</Title>
      <ThemeToggle theme={theme} toggle={toggle} />
    </Group>
  );
}
