import React from "react";

interface InfoProps {
  className?: string;
  fen?: string;
  message?: string;
}

export function Info(props: InfoProps) {
  return (
    <div className={`${props.className} p-4 flex flex-col items-center justify-center text-center`}>
      <h1 className="text-3xl font-bold mb-4 text-gray-300">Endgame Visualiser</h1>
      <p className="text-gray-600 mb-4">
        Drag pieces onto the board to set up a position. Then, select a piece to see all squares for it leading to winning/drawing/losing endgames for white.
      </p>
      <a className="bg-gray-700 text-gray-300 py-1 px-2 rounded cursor-pointer hover:bg-gray-600"
        title="Open lichess board editor"
        href={`https://lichess.org/editor/${props.fen}`}>
        FEN: {props.fen}
      </a>
      <p className="text-lg text-red-700">
        {props.message}
      </p>
    </div>
  );
}
