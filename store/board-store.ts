import { databases } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib/get-todos-grouped-by-columns";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (bord: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  bulkUpdate: (todos: Todo[]) => void;
  setDone: (todo: Todo, id: TypedColumn, index: number) => void;
}

const useBoardStore = create<BoardState>((set, get) => ({
  board: { columns: new Map<TypedColumn, Column>() },
  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    todo.status = columnId;
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId, index: todo.index }
    );
  },
  bulkUpdate: async (todos) => {
    todos.map(async (todo, i) => {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id,
        { index: i }
      );
    });
  },
  setDone: async (todo, id, index) => {
    todo.status = "done";
    const newColumns = new Map(get().board.columns);
    newColumns.get("done")?.todos.push(todo);
    const i = newColumns.get(id)?.todos.indexOf(todo);
    newColumns.get(id)?.todos.splice(i!, 1);
    set({ board: { columns: newColumns } });

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      { status: "done" }
    );
  },
}));

export default useBoardStore;
