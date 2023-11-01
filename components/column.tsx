"use client";

import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./todo-card";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

type ColumnProps = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: { [key in TypedColumn]: string } = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column = ({ id, todos, index }: ColumnProps) => {
  return (
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
                className={`pb-2 p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-400" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between items-center font-bold text-xl p-2">
                  {idToColumnText[id]}
                  <span className="text-gry-500 bg-gray-200 rounded-full font-normal px-3 py-1 text-sm">
                    {todos.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.$id}
                      draggableId={todo.$id}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          innerRef={provided.innerRef}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="flex items-end justify-end">
                    <button className="text-green-500 hover:text-green-600 transition">
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
