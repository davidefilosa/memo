"use client";

import useBoardStore from "@/store/board-store";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
  SnapDragActions,
} from "react-beautiful-dnd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  snapshot: DraggableStateSnapshot;
};

const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  dragHandleProps,
  draggableProps,
  snapshot,
}: Props) => {
  const [setDone, deleteTodo] = useBoardStore((state) => [
    state.setDone,
    state.deleteTodo,
  ]);
  return (
    <div
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
      className={`bg-white rounded-md drop-shadow-md space-y-2 flex flex-col ${
        snapshot.isDragging
          ? "bg-white/50 drop-shadow-xl"
          : "bg-white drop-shadow-md "
      }`}
    >
      <div className="flex items-center justify-between p-5">
        <p>{todo.title}</p>
        <div className="flex gap-x-1">
          {todo.status !== "done" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className="text-green-500 hover:text-green-600"
                    onClick={() => setDone(todo, todo.status)}
                  >
                    <CheckCircleIcon className=" h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark task as compleate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteTodo(todo, todo.status)}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div>
        {todo.image && (
          <Image
            alt={todo.title}
            src={todo.image}
            width={200}
            height={200}
            className="object-cover h-52 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default TodoCard;
