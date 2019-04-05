import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "./components/Board";

type stone = 0 | 1 | null;

interface WidthHeight {
  w: number;
  h: number;
}

export interface AppProps {}

export interface AppState {
  tarn: 0 | 1;
  boards: stone[];
  canPutBoards: stone[];
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      tarn: 0,
      boards: this.initialize(true),
      canPutBoards: this.initialize(false)
    };
    this.setStone = this.setStone.bind(this);
  }

  componentDidMount() {
    this.canPutStone();
  }

  // tslint:disable-next-line:variable-name
  componentDidUpdate(_PrevProps: AppProps, prevState: AppState) {
    if (prevState.tarn !== this.state.tarn) {
      console.log(prevState.tarn, this.state.tarn);
      this.canPutStone();
    }
  }

  returnWidthHeight(index: any): WidthHeight {
    return { w: index % 8, h: Math.floor(index / 8) };
  }

  reverseStone(
    i: number,
    j: number,
    h: number,
    w: number,
    isReverse: boolean
  ): boolean {
    console.log(i, j, h, w, isReverse);
    const boards = this.state.boards;
    const enemyStone = this.state.tarn === 0 ? 1 : 0;
    if (w < 0 || w > 7 || h < 0 || h > 7) {
      return false;
    }
    if (boards[h * 8 + w] === enemyStone) {
      if (this.reverseStone(i, j, h + i, w + j, isReverse)) {
        if (isReverse) {
          boards[h * 8 + w] = this.state.tarn;
          this.setState({ boards });
        }
        return true;
      }
      return false;
    }
    if (boards[h * 8 + w] === this.state.tarn) {
      return true;
    }
    return false;
  }

  putStone(index: any, isReverse: boolean): boolean {
    console.log(index, isReverse);
    const boards = this.state.boards;
    const { w, h } = this.returnWidthHeight(index);
    const enemyStone = this.state.tarn === 0 ? 1 : 0;
    let flag = false;
    if (boards[index] === 0 || boards[index] === 1) {
      return false;
    }
    for (let i = -1; i < 2; i += 1) {
      for (let j = -1; j < 2; j += 1) {
        if (i === 0 && j === 0) {
          continue;
        }
        if (w + j < 0 || w + j > 7 || h + i < 0 || h + i > 7) {
          continue;
        }
        if (boards[(h + i) * 8 + w + j] === enemyStone) {
          flag = this.reverseStone(i, j, h + i, w + j, isReverse) || flag;
        }
      }
    }

    return flag;
  }

  canPutStone() {
    const canPutBoards = this.state.canPutBoards;
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        if (this.putStone(i * 8 + j, false)) {
          canPutBoards[i * 8 + j] = 1;
        } else {
          canPutBoards[i * 8 + j] = 0;
        }
      }
    }
    this.setState({ canPutBoards });
  }

  setStone(i: any) {
    if (this.putStone(i, true)) {
      const boards = this.state.boards;
      boards[i] = this.state.tarn;
      this.setState({
        boards,
        tarn: this.state.tarn === 0 ? 1 : 0
      });
    }
  }

  initialize(isPutBoard: boolean): stone[] {
    const boards = Array(64);

    if (isPutBoard) {
      boards[27] = 1;
      boards[28] = 0;
      boards[35] = 0;
      boards[36] = 1;
    }

    return boards;
  }

  render() {
    const { boards, canPutBoards } = this.state;
    return (
      <div>
        {this.state.tarn === 0 ? "黒のターン" : "白のターン"}
        <Board
          boards={boards}
          setStone={this.setStone}
          canPutBoards={canPutBoards}
        />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
