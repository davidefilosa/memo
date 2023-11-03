import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib/get-todos-grouped-by-columns";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (bord: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  bulkUpdate: (todos: Todo[]) => void;
  setDone: (todo: Todo, id: TypedColumn) => void;
  deleteTodo: (todo: Todo, id: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  createTodo: (values: {
    title: string;
    status: string;
    image: string;
  }) => void;
  uploadImage: (image: File) => void;
  imageUrl: string;
  clearImageUrl: () => void;
}

const useBoardStore = create<BoardState>((set, get) => ({
  board: { columns: new Map<TypedColumn, Column>() },

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

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
  setDone: async (todo, id) => {
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
  deleteTodo: async (todo, id) => {
    const newColumns = new Map(get().board.columns);
    const i = newColumns.get(id)?.todos.indexOf(todo);
    newColumns.get(id)?.todos.splice(i!, 1);
    set({ board: { columns: newColumns } });

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  createTodo: async (values) => {
    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      { title: values.title, status: values.status, image: values?.image }
    );

    const todo: Todo = {
      title: document.title,
      status: document.status as TypedColumn,
      $id: document.$id,
      $createdAt: document.$createdAt,
      index: document.index,
      image: document.image,
    };
    const newColumns = new Map(get().board.columns);
    newColumns.get(todo.status)?.todos.push(todo);
    set({ board: { columns: newColumns } });
  },

  imageUrl: "",

  uploadImage: async (image: File) => {
    const file = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID!,
      ID.unique(),
      image
    );

    const imagehref = storage.getFileView(
      process.env.NEXT_PUBLIC_BUCKET_ID!,
      file.$id
    );

    set({ imageUrl: imagehref.href });
  },
  clearImageUrl: () => set({ imageUrl: "" }),
}));

export default useBoardStore;
