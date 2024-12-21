import React from "react";
import { Piece } from "chessground/types";

interface SparePieceProps {
  piece: Piece;
  isSelected: boolean;
  onSelection: (piece: Piece) => void;
  onDrag: (piece: Piece, event: Event) => void;
}

export function SparePiece(props: SparePieceProps) {
  return <div
    className={`${props.piece.color} ${props.piece.role} h-2/3 aspect-square bg-cover ${props.isSelected ? "bg-lime-800 hover:bg-gray-600" : "bg-gray-500 hover:bg-lime-700"} `}
    onClick={() => props.onSelection(props.piece)}
    onMouseDown={(e) => props.onDrag(props.piece, e.nativeEvent)}
    onTouchStart={(e) => props.onDrag(props.piece, e.nativeEvent)}
  />
}
