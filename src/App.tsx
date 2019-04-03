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
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      tarn: 0,
      boards: this.initialize()
    };
    this.setStone = this.setStone.bind(this);
  }

  returnWidthHeight(index: any): WidthHeight {
    return { w: index % 8, h: Math.floor(index / 8) };
  }

  reverseStone(i: number, j: number, h: number, w: number): boolean {
    const boards = this.state.boards;
    const enemyStone = this.state.tarn === 0 ? 1 : 0;
    if (w < 0 || w > 7 || h < 0 || h > 7) {
      return false;
    }
    if (boards[h * 8 + w] === enemyStone) {
      if (this.reverseStone(i, j, h + i, w + j)) {
        boards[h * 8 + w] = this.state.tarn;
        this.setState({ boards });
        return true;
      }
      return false;
    }
    if (boards[h * 8 + w] === this.state.tarn) {
      return true;
    }
    return false;
  }

  putStone(index: any): boolean {
    const boards = this.state.boards;
    const { w, h } = this.returnWidthHeight(index);
    const enemyStone = this.state.tarn === 0 ? 1 : 0;
    let flag = false;
    if (boards[index]) {
      return false;
    }
    for (let i = -1; i < 2; i += 1) {
      for (let j = -1; j < 2; j += 1) {
        if (w + j < 0 || w + j > 7 || h + i < 0 || h + i > 7) {
          continue;
        }
        if (boards[(h + i) * 8 + w + j] === enemyStone) {
          flag = this.reverseStone(i, j, h + i, w + j) || flag;
        }
      }
    }

    return flag;
  }

  setStone(i: any) {
    if (this.putStone(i)) {
      const boards = this.state.boards;
      boards[i] = this.state.tarn;
      this.setState({
        boards,
        tarn: this.state.tarn === 0 ? 1 : 0
      });
    }
  }

  initialize(): stone[] {
    const boards = Array(64);
    boards[27] = 1;
    boards[28] = 0;
    boards[35] = 0;
    boards[36] = 1;

    return boards;
  }

  render() {
    const boards = this.state.boards;
    return (
      <div>
        {this.state.tarn === 0 ? "黒のターン" : "白のターン"}
        <Board boards={boards} setStone={this.setStone} />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
