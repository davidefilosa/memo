"use client";

import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./todo-card";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrashIcon } from "@heroicons/react/24/solid";
import useBoardStore from "@/store/board-store";
import useModalStore from "@/store/modal-store";

type ColumnProps = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: { [key in TypedColumn]: string } = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
  trash: "Trash",
};

const Column = ({ id, todos, index }: ColumnProps) => {
  const [searchString] = useBoardStore((state) => [state.searchString]);
  const modalStore = useModalStore();
  return (
    <>
      {id === "trash" ? (
        <div className="relative md:row-start-2 md:col-span-3 row-start-4">
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`opcity-0 ${
                  snapshot.isDraggingOver ? " opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-full flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-t from-purple-400 to-red-500 rounded-md filter blur-3xl  -z-50" />
                  <TrashIcon className="w-24 h-24 text-white filter-none opacity-75" />
                </div>
              </div>
            )}
          </Droppable>
        </div>
      ) : (
        <Draggable draggableId={id} index={index}>
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <Droppable droppableId={index.toString()} type="card">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`pb-2 p-2 m-2 rounded-2xl shadow-sm ${
                      snapshot.isDraggingOver
                        ? "bg-green-500 opacity-50"
                        : "bg-white/50 opacity-100"
                    }`}
                  >
                    <h2 className="flex justify-between items-center font-bold text-xl p-2">
                      {idToColumnText[id]}
                      <span className="text-gry-500 bg-gray-200 rounded-full font-normal px-3 py-1 text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger> {todos.length}</TooltipTrigger>
                            <TooltipContent>
                              <p>{`You have ${todos.length} ${
                                todos.length === 1 ? "task" : "tasks"
                              } ${idToColumnText[id].toLowerCase()}.`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                    </h2>
                    <div className="space-y-2">
                      {todos.map((todo, index) => {
                        if (
                          searchString &&
                          !todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ) {
                          return null;
                        }
                        return (
                          <Draggable
                            key={todo.$id}
                            draggableId={todo.$id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <TodoCard
                                todo={todo}
                                index={index}
                                id={id}
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                innerRef={provided.innerRef}
                                snapshot={snapshot}
                              />
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      <div className="flex items-end justify-end">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <button
                                className="text-green-500 hover:text-green-600 transition"
                                onClick={() => modalStore.onOpen(id)}
                              >
                                <PlusCircleIcon className="h-8 w-8" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add a new task</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          )}
        </Draggable>
      )}
    </>
  );
};

export default Column;
