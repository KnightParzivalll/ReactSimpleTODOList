import { ActionIcon } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export function ThemeToggle({
  theme,
  toggle,
}: {
  theme: "light" | "dark";
  toggle: () => void;
}) {
  return (
    <ActionIcon
      onClick={toggle}
      variant="light"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      color={theme === "dark" ? "yellow" : "blue"}
    >
      {theme === "dark" ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  );
}
