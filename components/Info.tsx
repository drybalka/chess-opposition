import React from "react";

interface InfoProps {
  className?: string;
  message?: string;
}

export function Info(props: InfoProps) {
  return (
    <div className={`${props.className} max-w-md mx-auto p-4 text-center`}>
      <h1 className="text-3xl font-bold mb-4 text-gray-300">Endgame Visualiser</h1>
      <p className="text-gray-600 mb-4">
        Drag pieces onto the board to set up a position. Then, select a piece to see all squares for it leading to winning/drawing/losing endgames for white.
      </p>
      <p className="text-lg text-red-700">
        {props.message}
      </p>
    </div>
  );
}
