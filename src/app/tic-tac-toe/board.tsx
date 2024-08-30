"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getData, setData } from "../../util/localstorage";

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

export default function Board() {
  const { data: session } = useSession();
  const user = session?.user;

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

  const checkDraw = async (): Promise<boolean> => {
    const isDraw = Object.keys(boardData).every((value) => boardData[+value]);

    if (isDraw) {
      setModalTitle("Match Draw!");
      setStreak(0);
      setFinish(true);
    }

    return isDraw;
  };

  const checkWinner = async (): Promise<boolean> => {
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

        if (!playerTurn) {
          setScore((oldScore) => (oldScore += 1));
          if (streak >= 2) {
            setScore((oldScore) => (oldScore += 1));
            setStreak(0);
          } else {
            setStreak((oldStreak) => (oldStreak += 1));
          }
        } else {
          score > 0 && setScore((oldScore) => (oldScore -= 1));
          setStreak(0);
        }
      }
    });

    return hasWinner;
  };

  const judgeBoard = async () => {
    if (await checkWinner()) return;

    if (await checkDraw()) return;

    if (!playerTurn && !finish) {
      updateBotTurn();
    }
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
    judgeBoard();
  }, [boardData]);

  useEffect(() => {
    if (!user?.email) return;

    const { score = 0, streak = 0 } = JSON.parse(getData(user?.email) || "{}");
    setScore(score);
    setStreak(streak);
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    setData(user?.email, JSON.stringify({ score, streak }));
  }, [score, streak]);

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div className="game">
        <div className="game__menu">
          <p>{playerTurn ? "Player Turn" : "Bot Turn"}</p>
          <p>
            Score: {score}, Streak: {streak}
          </p>
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
