import * as React from "react";
// import blackSvg from "../images/black.svg";
// import whiteSvg from "../images/white.svg";

type stone = 0 | 1 | 2;
const showedBoards = ["●", "○", ""];
const backgroundStyle = { backgroundColor: "#dd6" };

export interface BoardProps {
  boards: stone[];
  setStone: Function;
  canPutBoards: stone[];
}

export interface BoardState {}

class Board extends React.Component<BoardProps, BoardState> {
  render() {
    const { boards, setStone, canPutBoards } = this.props;

    const boardContainer: any = [];
    for (let i = 0; i < 64; i += 1) {
      boardContainer.push(
        <li
          key={i}
          className="board__item"
          onClick={setStone.bind(this, i)}
          style={canPutBoards[i] === 1 ? backgroundStyle : {}}
        >
          {showedBoards[boards[i]]}
        </li>
      );
    }

    return (
      <div className="board">
        <ul className="board__items">{boardContainer}</ul>
      </div>
    );
  }
}

export default Board;
