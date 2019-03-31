import * as React from "react";

type Stone = 0 | 1 | null;

export interface BoardProps {
  boards: Stone[];
  setStone: Function;
}

export interface BoardState {}

class Board extends React.Component<BoardProps, BoardState> {
  render() {
    const { boards, setStone } = this.props;

    const boardContainer: any = [];
    for (let i = 0; i < 64; i += 1) {
      boardContainer.push(
        <li key={i} className="board__item" onClick={setStone.bind(this, i)}>
          {boards[i]}
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
