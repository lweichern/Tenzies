import React, { useState, useEffect } from "react";
import Dice from "./Dice";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [recordTime, setRecordTime] = useState(
    JSON.parse(localStorage.getItem("record")) || []
  );
  const [reroll, setReroll] = useState(0);
  const [rerollNumArray, setRerollNumArray] = useState(
    JSON.parse(localStorage.getItem("reroll")) || []
  );

  useEffect(() => {
    const firstNumber = dice[0].value;
    const allHeldDice = dice.every((die) => die.isHeld);
    const allSameNumber = dice.every((die) => die.value === firstNumber);

    if (allSameNumber && allHeldDice) {
      setTenzies(true);
    }
  }, [dice]);

  useEffect(() => {
    localStorage.setItem("record", JSON.stringify(recordTime));
  }, [recordTime]);

  useEffect(() => {
    if (tenzies) {
      const endTime = new Date();
      const timeDiff = (endTime - startTime) / 1000;
      setRecordTime((prevRecordTime) => [...prevRecordTime, timeDiff]);

      setRerollNumArray((prevRerollNum) => [...prevRerollNum, reroll]);
      console.log(recordTime);
    }
  }, [tenzies]);

  useEffect(() => {
    localStorage.setItem("reroll", JSON.stringify(rerollNumArray));
  }, [rerollNumArray]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDice());
    }
    return newDice;
  }

  function generateNewDice() {
    const newDice = {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };

    return newDice;
  }

  function holdDice(id) {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die;
      })
    );
  }

  function rollDice() {
    if (!tenzies) {
      setDice((prevDice) =>
        prevDice.map((die) => {
          return die.isHeld ? die : generateNewDice();
        })
      );
      setReroll((prevRoll) => prevRoll + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice);
      setReroll(0);
    }
  }

  function removeOverlay() {
    setTenzies(false);
    setDice(allNewDice);
    setReroll(0);
  }

  const diceElements = dice.map((die) => (
    <Dice
      key={die.id}
      id={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={holdDice}
    />
  ));

  const lowestValue = Math.min(...recordTime);
  const lowestReroll = Math.min(...rerollNumArray);

  const styles = {
    backgroundColor: tenzies ? "rgba(0, 0, 0, 0.9)" : "none",
  };

  return (
    <div>
      {tenzies && <div className="overlay" style={styles}></div>}
      {tenzies && (
        <div className="personal-record-container">
          <h1>Congratulations!</h1>
          <h3>Time taken: {recordTime[recordTime.length - 1]}s</h3>
          <h3>Number of Rolls: {reroll}</h3>
          <button className="reset-game-btn" onClick={removeOverlay}>
            Reset Game
          </button>
        </div>
      )}

      <main>
        {tenzies && <Confetti />}

        <div className="description">
          <h1 className="title">Tenzies</h1>
          <h4 className="how-to-play">
            Roll until all dices are the same. Click each die to freeze it at
            its current value between rolls.
          </h4>
        </div>

        <div className="record-container">
          <h2 className="record-time">
            Time to beat:{" "}
            {recordTime.length !== 0 ? `${lowestValue.toFixed(2)}s` : "-"}
          </h2>
          <h2 className="lowest-reroll">
            Lowest reroll: {rerollNumArray.length !== 0 ? lowestReroll : "-"}
          </h2>
        </div>

        <div className="dice-container">{diceElements}</div>
        <button className="roll-btn" onClick={rollDice}>
          {tenzies ? "Reset Roll" : "Roll"}
        </button>
      </main>
    </div>
  );
}
