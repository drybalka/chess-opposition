'use client';

import '@/assets/theme.css'
import '@/assets/chessground.css'

import { useEffect, useRef, useState } from "react";
import { Chessground } from 'chessground';
import { Key, files, ranks, Piece } from "chessground/types";
import { write as fenWrite } from "chessground/fen";
import { Api } from 'chessground/api';
import { Spares } from './Spares';

const squares = files.flatMap(f => ranks.map(r => f + r as Key));

const defaultConfig = {
  coordinates: false,
  fen: "8/8/4k3/8/8/8/3P4/8 b - - 0 1",
  highlight: { lastMove: false, check: false },
  draggable: { deleteOnDropOff: true },
};

export default function Board() {
  const root = useRef<HTMLDivElement>(null);
  const [ground, setGround] = useState<Api | null>(null);
  useEffect(() => {
    if (!root.current) { return };
    setGround(Chessground(root.current, defaultConfig));
  }, []);

  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  useEffect(() => {
    if (!ground) { return };
    if (!selectedPiece) {
      ground.set({
        events: { change: undefined },
        highlight: { custom: undefined }
      });
    } else {
      highlightOutcomes(ground, selectedPiece);
      ground.set({ events: { change: () => highlightOutcomes(ground, selectedPiece) } });
    }
  }, [selectedPiece]);

  const selectSparePiece = (piece: Piece) => {
    if (piece.color === selectedPiece?.color && piece.role === selectedPiece?.role) {
      setSelectedPiece(null);
    } else {
      setSelectedPiece(piece);
    }
  }

  return (
    <div className="flex flex-col aspect-[8/11] max-h-dvh mx-auto">
      <Spares className="flex-1"
        color="black"
        position="top"
        selectedPiece={selectedPiece}
        onPieceSelection={selectSparePiece}
        onPieceDrag={(piece, event) => ground?.dragNewPiece(piece, event, true)}
      />
      <div ref={root} className="flex-1" />
      <Spares className="flex-1"
        color="white"
        position="bottom"
        selectedPiece={selectedPiece}
        onPieceSelection={selectSparePiece}
        onPieceDrag={(piece, event) => ground?.dragNewPiece(piece, event, true)}
      />
    </div>
  );
}

function highlightOutcomes(ground: Api, piece: Piece) {
  const highlightPromises: Promise<[Key, string]>[] = squares
    .filter(square => {
      const occupied = ground.state.pieces.keys();
      return !occupied.some(s => s == square)
    })
    .map(async square => {
      const pieces = ground.state.pieces;
      pieces.set(square, piece)
      const newFen = fenWrite(pieces);
      pieces.delete(square);

      const response = await fetch(`https://tablebase.lichess.ovh/standard?fen=${newFen}`);
      const body = await response.json();
      return [square, body.category] as [Key, string];
    });

  Promise.allSettled(highlightPromises)
    .then(values => {
      const highlights = values.filter(v => v.status == 'fulfilled').map(v => v.value);
      ground.set({
        highlight: {
          custom: new Map(highlights)
        }
      })
    });
}
