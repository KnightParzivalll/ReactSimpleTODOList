import { useCallback, useState } from "react";
import type { Task } from "../types/task";

export interface FormState {
  title: string;
  description: string;
}

export interface ModalState {
  isOpen: boolean;
  isEditing: boolean;
  editingTaskId: number | null;
  formData: FormState;
}

const initialModalState: ModalState = {
  isOpen: false,
  isEditing: false,
  editingTaskId: null,
  formData: { title: "", description: "" },
};

export function useModal() {
  const [modal, setModal] = useState<ModalState>(initialModalState);

  const openNewTaskModal = useCallback(() => {
    setModal({
      isOpen: true,
      isEditing: false,
      editingTaskId: null,
      formData: { title: "", description: "" },
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(initialModalState);
  }, []);

  const updateFormData = useCallback(
    (field: "title" | "description", value: string) => {
      setModal((prev) => ({
        ...prev,
        formData: { ...prev.formData, [field]: value },
      }));
    },
    [],
  );

  const startEdit = useCallback((task: Task) => {
    setModal({
      isOpen: true,
      isEditing: true,
      editingTaskId: task.id,
      formData: { title: task.title, description: task.description },
    });
  }, []);

  return {
    modal,
    openNewTaskModal,
    closeModal,
    updateFormData,
    startEdit,
  };
}
