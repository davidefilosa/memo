"use client";

import CreateTodoForm from "./create-todo-form";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import useModalStore from "@/store/modal-store";

const createTodoModal = () => {
  const modalStore = useModalStore();

  return (
    <Dialog open={modalStore.open} onOpenChange={modalStore.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Add a task</h2>
        </DialogHeader>
        <CreateTodoForm />
      </DialogContent>
    </Dialog>
  );
};

export default createTodoModal;
