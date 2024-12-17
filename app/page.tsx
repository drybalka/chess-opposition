import Chessground from "@/components/Chessground";

export default function Home() {
  return (
    <main>
      <Chessground orientation="white" coordinates={false} fen="8/8/4k3/8/8/8/3P4/8 b - - 0 1" />
    </main>
  );
}

// export default function Home() {
//   return (
//     <main>
//       <div className="flex flex-col aspect-[2/3] max-h-screen max-v-screen bg-teal-500 gap-4 p-4">
//         <div className="flex-1 bg-red-200" />
//         <div className="flex-[2_2_0%] bg-red-700">
//           <Chessground orientation="white" coordinates={false} fen="8/8/4k3/8/8/8/3P4/8 b - - 0 1" />
//         </div>
//       </div>
//     </main>
//   );
// }
