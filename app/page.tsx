import Board from "@/components/board";
import Header from "@/components/header";
import useBoardStore from "@/store/board-store";

export default function Home() {
  return (
    <div>
      <Header />
      <Board />
    </div>
  );
}
