"use client";

import useBoardStore from "@/store/board-store";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./column";
import { getTodosGroupedByColumns } from "@/lib/get-todos-grouped-by-columns";
import { useRouter } from "next/navigation";

const Board = () => {
  const [board, getBoard, setBoardState, updateTodoInDB, bulkUpdate] =
    useBoardStore((state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
      state.bulkUpdate,
    ]);

  useEffect(() => {
    getBoard();
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    // handle colummn drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());

      // get column dragged
      const [removed] = entries.splice(source.index, 1);
      // add to destination
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
    } else {
      const columns = Array.from(board.columns);
      const startColIndex = columns[Number(source.droppableId)];
      const finishColIndex = columns[Number(destination.droppableId)];
      const startCol: Column = {
        id: startColIndex[0],
        todos: startColIndex[1].todos,
      };

      const finischCol: Column = {
        id: finishColIndex[0],
        todos: finishColIndex[1].todos,
      };

      if (!startCol || !finischCol) return;

      if (source.index === destination.index && startCol === finischCol) return;

      const newTodos = startCol.todos;

      const [todoMoved] = newTodos.splice(source.index, 1);

      if (startCol.id === finischCol.id) {
        // same coulumn drag past
        newTodos.splice(destination.index, 0, todoMoved);

        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };
        const newColumns = new Map(board.columns);
        newColumns.set(newCol.id, newCol);
        bulkUpdate(newTodos);

        setBoardState({ ...board, columns: newColumns });
      } else {
        // dragging new column
        const finishTodos = Array.from(finischCol.todos);
        finishTodos.splice(destination.index, 0, todoMoved);
        const newColumns = new Map(board.columns);

        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };
        newColumns.set(startCol.id, newCol);
        newColumns.set(finischCol.id, {
          id: finischCol.id,
          todos: finishTodos,
        });

        // update DB
        bulkUpdate(newTodos);
        bulkUpdate(finishTodos);

        updateTodoInDB(todoMoved, finischCol.id);

        setBoardState({ ...board, columns: newColumns });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
