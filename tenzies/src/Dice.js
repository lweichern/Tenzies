import React from "react";

export default function Dice(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "#ffffff",
  };

  return (
    <div
      className="dice-face"
      onClick={() => props.holdDice(props.id)}
      style={styles}
    >
      <h2 className="dice-num">{props.value}</h2>
    </div>
  );
}
