import React from "react";
import { SparePiece } from "@/components/SparePiece";
import { Color, Piece, Role } from "chessground/types";

const roles = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'] as Role[];

interface SparesProps {
  className?: string;
  color: Color;
  position: "top" | "bottom";
  selectedPiece?: Piece | null;
  onPieceSelection: (piece: Piece) => void;
  onPieceDrag: (piece: Piece, event: Event) => void;
}

export function Spares(props: SparesProps) {
  return (
    <div className={`${props.className} flex flex-row justify-center ${props.position === "bottom" ? "items-end" : "items-start"}`} >
      {roles.map((role) => {
        const piece = { role: role, color: props.color };
        return <SparePiece
          key={`${piece.color} ${piece.role}`}
          piece={piece}
          isSelected={props.selectedPiece?.role == piece.role && props.selectedPiece?.color == piece.color}
          onSelection={props.onPieceSelection}
          onDrag={props.onPieceDrag}
        />
      })}
    </div>
  );
}
