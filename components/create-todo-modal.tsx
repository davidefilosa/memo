"use client";

import { useEffect, useState } from "react";
import CreateTodoForm from "./create-todo-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import useModalStore from "@/store/modal-store";
import useBoardStore from "@/store/board-store";
import axios from "axios";

const CreateTodoModal = () => {
  const modalStore = useModalStore();
  const [suggestion, setSuggestion] = useState("");
  const [board] = useBoardStore((state) => [state.board]);

  const todos = Array.from(board.columns.entries());
  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;
    return map;
  }, {} as { [key in TypedColumn]: Todo[] });

  useEffect(() => {
    if (board.columns.size === 0) return;
    const getSummary = async () => {
      const response = await axios.post("/api/getSuggestion", {
        todos: flatArray,
      });

      setSuggestion(response.data.content);
      console.log(response);
    };

    getSummary();
  }, [board, modalStore.open]);

  return (
    <Dialog open={modalStore.open} onOpenChange={modalStore.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Add a task</h2>
          <DialogDescription className="text-center text-sm font-semibold italic">
            {suggestion}
          </DialogDescription>
        </DialogHeader>
        <CreateTodoForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTodoModal;
