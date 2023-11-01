"use client";

import useBoardStore from "@/store/board-store";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  dragHandleProps,
  draggableProps,
}: Props) => {
  const [setDone] = useBoardStore((state) => [state.setDone]);
  return (
    <div
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
      className="bg-white rounded-md drop-shadow-md space-y-2"
    >
      <div className="flex items-center justify-between p-5">
        <p>{todo.title}</p>
        <div className="flex gap-x-1">
          {todo.status !== "done" && (
            <button
              className="text-green-500 hover:text-green-600"
              onClick={() => setDone(todo, todo.status, todo.index)}
            >
              <CheckCircleIcon className=" h-6 w-6" />
            </button>
          )}

          <button className="text-red-500 hover:text-red-600">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
