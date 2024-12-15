'use client';

import '@/components/Chessground/base.css';
import '@/components/Chessground/brown.css';
import '@/components/Chessground/cburnett.css';
import '@/components/Chessground/highlight.css';

import { useEffect, useRef } from "react";
import { Chessground as CG } from 'chessground';
import { Config } from "chessground/config";
import { Key, files, ranks, Piece } from "chessground/types";
import { write as fenWrite } from "chessground/fen";

const squares = files.flatMap(f => ranks.map(r => f + r as Key));

export default function Chessground(config: Config) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) { return };
    const ground = CG(root.current, config);

    const highlightPromises: Promise<[Key, string]>[] = squares
      .filter(square => {
        const occupied = ground.state.pieces.keys();
        return !occupied.some(s => s == square)
      })
      .map(async square => {
        const pieces = ground.state.pieces;
        const king: Piece = { role: "king", color: "white" };
        pieces.set(square, king)
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



    ground.set({
      events: {
        select: (key: Key) => {
          const fen = ground.getFen();
          fetch(`https://tablebase.lichess.ovh/standard?fen=${fen}`).
            then(response => response.json()).
            then(body => {
              const result = body.category;
              ground.set({
                highlight: {
                  custom: new Map([[key, result]])
                }
              })
            });


        }
      }
    })
  }, []);

  return <div ref={root} />;
}
