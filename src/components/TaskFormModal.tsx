import { Modal, TextInput, Button, Group } from "@mantine/core";

interface Props {
  opened: boolean;
  onClose: () => void;
  title: string;
  description: string;
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  onSubmit: () => void;
  modalTitle: string;
  modalButtonText: string;
  loading?: boolean;
}

export function TaskFormModal({
  opened,
  onClose,
  title,
  description,
  setTitle,
  setDescription,
  onSubmit,
  modalTitle,
  modalButtonText,
  loading = false,
}: Props) {
  return (
    <Modal opened={opened} onClose={onClose} title={modalTitle} centered>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSubmit();
          onClose();
        }}
      >
        <TextInput
          label="Title"
          placeholder="Task Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mt="md"
          disabled={loading}
        />

        <TextInput
          label="Summary"
          placeholder="Task Summary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mt="md"
          disabled={loading}
        />

        <Group mt="md" justify="space-between">
          <Button
            variant="subtle"
            onClick={onClose}
            aria-label="Cancel task editing"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" aria-label={modalButtonText} loading={loading}>
            {modalButtonText}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
