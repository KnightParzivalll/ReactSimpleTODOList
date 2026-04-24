import { Title, Group, ActionIcon } from "@mantine/core";
import { IconSettings, IconArrowLeft } from "@tabler/icons-react";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";

export function Header({
  theme,
  toggle,
  isSettingsDisabled,
}: {
  theme: "light" | "dark";
  toggle: () => void;
  isSettingsDisabled: boolean;
}) {
  const location = useLocation();
  const isSettings = location.pathname === "/ReactSimpleTODOList/settings";

  return (
    <Group justify="space-between">
      <Title fw={900}>My Tasks</Title>
      <Group gap="sm">
        <ThemeToggle theme={theme} toggle={toggle} />
        <ActionIcon
          component={Link}
          to={
            isSettings
              ? "/ReactSimpleTODOList"
              : "/ReactSimpleTODOList/settings"
          }
          aria-label={isSettings ? "Back to tasks" : "Settings"}
          variant="default"
          onClick={(e) => {
            if (isSettingsDisabled) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          style={{
            pointerEvents: isSettingsDisabled ? "none" : "auto",
            opacity: isSettingsDisabled ? 0.5 : 1,
          }}
        >
          {isSettings ? (
            <IconArrowLeft size={18} />
          ) : (
            <IconSettings size={18} />
          )}
        </ActionIcon>
      </Group>
    </Group>
  );
}
