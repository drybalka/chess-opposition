import Chessground from "@/components/Chessground";

export default function Home() {
  return (
    <main>
      <Chessground orientation="white" coordinates={false} fen="8/8/4k3/8/8/8/3P4/8 b - - 0 1" />
    </main>
  );
}
