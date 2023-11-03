"use client";

import { useEffect, useState } from "react";
import CreateTodoModal from "./create-todo-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <CreateTodoModal />;
};

export default ModalProvider;
