interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "todo" | "inprogress" | "done" | "trash";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo extends Modals.Document {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: string;
  index: number;
}

interface Image {
  bucketId: string;
  fileId: string;
}
