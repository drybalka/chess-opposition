'use client';

import '@/assets/theme.css'
import '@/assets/chessground.css'

import { useEffect, useRef, useState } from "react";
import { Chessground } from 'chessground';
import { Key, files, ranks, Piece } from "chessground/types";
import { write as fenWrite } from "chessground/fen";
import { Api } from 'chessground/api';
import { Spares } from './Spares';
import { Info } from './Info';

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
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    if (!ground) { return };
    if (!selectedPiece) {
      setErrorMessage("");
      ground.set({
        events: { change: undefined },
        highlight: { custom: undefined }
      });
    } else {
      highlightOutcomes(ground, selectedPiece, setErrorMessage);
      ground.set({ events: { change: () => highlightOutcomes(ground, selectedPiece, setErrorMessage) } });
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
    <>
      <div className="grid md:grid-cols-[2fr_1fr] grid-rows-[1.5fr_8fr_1.5fr_0fr] aspect-[8/11] md:aspect-[12/11] max-h-dvh m-auto p-4">
        <Spares className="row-start-1"
          color="black"
          position="top"
          selectedPiece={selectedPiece}
          onPieceSelection={selectSparePiece}
          onPieceDrag={(piece, event) => ground?.dragNewPiece(piece, event, true)}
        />
        <div ref={root} className="row-start-2" />
        <Spares className="row-start-3"
          color="white"
          position="bottom"
          selectedPiece={selectedPiece}
          onPieceSelection={selectSparePiece}
          onPieceDrag={(piece, event) => ground?.dragNewPiece(piece, event, true)}
        />
        <Info className="hidden md:block row-start-2 row-span-3 col-start-2" message={errorMessage} />
      </div>
      <Info className="md:hidden" message={errorMessage} />
    </>
  );
}

function highlightOutcomes(ground: Api, piece: Piece, setErrorMessage: (message: string) => void) {
  const errorMessage = validateBoardState(ground, piece);
  setErrorMessage(errorMessage);
  if (errorMessage) {
    ground.set({ highlight: { custom: undefined } });
    return;
  }

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
      if (response.status === 429) {
        setErrorMessage("Too many requests, some squares are not highlighted. Try again later.");
      }
      const body = await response.json();
      return [square, body.category] as [Key, string];
    });

  Promise.allSettled(highlightPromises)
    .then(values => {
      const highlights = values.filter(v => v.status === 'fulfilled').map(v => v.value);
      ground.set({
        highlight: {
          custom: new Map(highlights)
        }
      })
    });
}

function validateBoardState(ground: Api, spare: Piece): string {
  const pieces = ground.state.pieces.values().toArray();
  pieces.push(spare);
  if (pieces.length > 7) {
    return "Too many pieces."
  }
  const kings = pieces.filter(p => p.role == "king").map(p => p.color);
  if (kings.length !== 2 || !kings.includes("white") || !kings.includes("black")) {
    return "There must be 2 kings of opposite color on the board.";
  }
  return "";
}

