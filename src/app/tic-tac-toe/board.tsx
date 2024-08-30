"use client";

import { useEffect, useState } from "react";

type BoardData = {
  [key: number]: string;
};

type WonCombo = number[];

const WINNING_COMBO: WonCombo[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function Board() {
  const [playerTurn, setPlayerTurn] = useState<boolean>(true);
  const [finish, setFinish] = useState<boolean>(false);
  const [draw, setDraw] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");

  const [boardData, setBoardData] = useState<BoardData>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
  });

  const [wonCombo, setWonCombo] = useState<WonCombo>([]);

  const updateBoardData = (idx: number, value: string): void => {
    if (boardData[idx]) return;

    setBoardData({ ...boardData, [idx]: value });
  };

  const updatePlayerTurn = (idx: number): void => {
    if (finish || boardData[idx]) return;

    updateBoardData(idx, "X");
    setPlayerTurn(false);
  };

  const updateBotTurn = (): void => {
    if (finish) return;

    const unsetIdx = Object.entries(boardData)
      .filter(([_, value]) => !value)
      .map(([key]) => +key);

    const randomIdx = unsetIdx[Math.floor(Math.random() * unsetIdx.length)];

    updateBoardData(randomIdx, "O");
    setPlayerTurn(true);
  };

  const checkDraw = (): boolean => {
    const isDraw = Object.keys(boardData).every((value) => boardData[+value]);

    if (isDraw) {
      setDraw(true);
      setModalTitle("Match Draw!");
      setFinish(true);
    }

    return isDraw;
  };

  const checkWinner = (): boolean => {
    let hasWinner = false;

    WINNING_COMBO.forEach((combo) => {
      const [a, b, c] = combo;
      if (
        boardData[a] &&
        boardData[a] === boardData[b] &&
        boardData[a] === boardData[c]
      ) {
        setFinish(true);
        setWonCombo([a, b, c]);
        setModalTitle(
          `${!playerTurn ? "Winner Winner Chicken Dinner!!!" : "You Lose..."}`
        );
        hasWinner = true;
      }
    });

    return hasWinner;
  };

  const reset = (): void => {
    setBoardData({
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
    });
    setPlayerTurn(true);
    setFinish(false);
    setWonCombo([]);
    setDraw(false);
    setModalTitle("");
  };

  useEffect(() => {
    // Check for a winner first
    if (checkWinner()) return;

    // If no winner, check for a draw
    if (checkDraw()) return;

    if (!playerTurn && !finish) {
      updateBotTurn();
    }
  }, [boardData]);

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div className="game">
        <div className="game__menu">
          <p>{playerTurn ? "Player Turn" : "Bot Turn"}</p>
        </div>
        <div className="game__board">
          {[...Array(9)].map((_, idx) => {
            return (
              <div
                onClick={() => updatePlayerTurn(idx)}
                key={idx}
                className={`square ${
                  wonCombo.includes(idx) ? "highlight" : ""
                }`}
              >
                {boardData[idx]}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`modal ${modalTitle ? "show" : ""}`}>
        <div className="modal__title">{modalTitle}</div>
        <button onClick={reset}>New Game</button>
      </div>
    </div>
  );
}
