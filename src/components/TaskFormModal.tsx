import { Modal, TextInput, Button, Group } from "@mantine/core";

export interface FormState {
  title: string;
  description: string;
}

interface Props {
  opened: boolean;
  onClose: () => void;
  formData: FormState;
  onChange: (field: "title" | "description", value: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
  loading?: boolean;
}

export function TaskFormModal({
  opened,
  onClose,
  formData,
  onChange,
  onSubmit,
  isEditing,
}: Props) {
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "New Task"}
      centered
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Title"
          placeholder="Task Title"
          required
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          mt="md"
        />

        <TextInput
          label="Summary"
          placeholder="Task Summary"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          mt="md"
        />

        <Group mt="md" justify="space-between">
          <Button
            variant="subtle"
            onClick={onClose}
            aria-label="Cancel task editing"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            aria-label={isEditing ? "Save Changes" : "Create Task"}
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
