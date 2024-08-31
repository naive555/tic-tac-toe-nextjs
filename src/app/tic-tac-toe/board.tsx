"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { getUser } from "../profile/page";
import Loader from "../../components/loading";

import _ from "lodash";

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

const BOARD_TURN = [true, false];

export async function updateScore(
  email: string,
  score: number,
  streak: number
) {
  if (!email) return;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    method: "PUT",
    body: JSON.stringify({
      email,
      score,
      streak,
    }),
  });
  if (!res.ok) {
    console.error("Failed to fetch data");
  }

  return res.json();
}

export default function Board() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState<boolean>(false);

  const [playerTurn, setPlayerTurn] = useState<boolean>(true);
  const [finish, setFinish] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

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

  const getScore = async () => {
    setLoading(true);

    const userRes = await getUser(user?.email || "");
    setScore(userRes?.score || 0);
    setStreak(userRes?.streak || 0);

    setLoading(false);
  };

  const updateBoardData = (index: number, value: string): void => {
    if (boardData[index]) return;

    setBoardData({ ...boardData, [index]: value });
  };

  const updatePlayerTurn = (index: number): void => {
    if (finish || boardData[index]) return;

    updateBoardData(index, "X");
    setPlayerTurn(false);
  };

  const updateBotTurn = (): void => {
    if (finish) return;

    const unuseIndex = Object.entries(boardData)
      .filter(([_, value]) => !value)
      .map(([key]) => +key);

    const randomIndex =
      unuseIndex[Math.floor(Math.random() * unuseIndex.length)];

    updateBoardData(randomIndex, "O");
    setPlayerTurn(true);
  };

  const checkDraw = (): boolean => {
    const isBoardFull = Object.keys(boardData).every(
      (value) => boardData[+value]
    );

    if (isBoardFull) {
      setModalTitle("Match Draw!");
      setStreak(0);
      setFinish(true);
    }

    return isBoardFull;
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

        hasWinner = true;

        if (!playerTurn) {
          setScore((oldScore) => (oldScore += 1));
          if (streak >= 2) {
            setScore((oldScore) => (oldScore += 1));
            setStreak(0);
          } else {
            setStreak((oldStreak) => (oldStreak += 1));
          }

          setModalTitle("Winner Winner Chicken Dinner!!!");
        } else {
          score > 0 && setScore((oldScore) => (oldScore -= 1));
          setStreak(0);

          setModalTitle("You Lose...");
        }
      }
    });

    return hasWinner;
  };

  const judgeBoard = async () => {
    setLoading(true);
    await updateScore(user?.email || "", score, streak);
    setLoading(false);
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
    setPlayerTurn(BOARD_TURN[Math.floor(Math.random() * BOARD_TURN.length)]);
    setFinish(false);
    setWonCombo([]);
    setModalTitle("");
  };

  useEffect(() => {
    if (checkWinner()) return;

    if (checkDraw()) return;

    if (!playerTurn && !finish) {
      updateBotTurn();
    }
  }, [boardData]);

  useEffect(() => {
    if (!finish) return;
    judgeBoard();
  }, [finish]);

  useEffect(() => {
    if (!user?.email) return;
    getScore();
  }, [user]);

  if (!process.env.NEXT_PUBLIC_API_URL) {
    return null;
  }

  return (
    <div>
      <Loader loading={loading} />
      <h1>Tic Tac Toe</h1>
      <div className="game">
        <div className="game__menu">
          <p>{playerTurn ? "Your Turn" : "Bot Turn"}</p>
          <p>Score: {score}</p>
        </div>
        <div className="game__board">
          {[...Array(9)].map((_, index) => {
            return (
              <div
                onClick={() => updatePlayerTurn(index)}
                key={index}
                className={`square ${
                  wonCombo.includes(index) ? "highlight" : ""
                }`}
              >
                {boardData[index]}
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
