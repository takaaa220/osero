import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "./components/Board";
import EndGameModal from "./components/EndGameModal";

type stone = 0 | 1 | 2 | null;

interface WidthHeight {
  w: number;
  h: number;
}

export interface AppProps {}

export interface AppState {
  tarn: 0 | 1 | 2;
  boards: stone[];
  canPutBoards: stone[];
  whiteStoneNum: number;
  blackStoneNum: number;
  isFinished: boolean;
  isPassed: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      tarn: 0,
      boards: this.initialize(true),
      canPutBoards: this.initialize(false),
      whiteStoneNum: 2,
      blackStoneNum: 2,
      isFinished: false,
      isPassed: false
    };
    this.setStone = this.setStone.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
  }

  componentDidMount() {
    this.canPutStone();
  }

  // tslint:disable-next-line:variable-name
  componentDidUpdate(_PrevProps: AppProps, prevState: AppState) {
    // restart game
    if (this.state.tarn === 2) {
      this.setState({
        boards: this.initialize(true),
        isFinished: false,
        tarn: 0
      });
    } else if (prevState.tarn !== this.state.tarn) {
      const boards = this.state.boards;
      const blackStoneNum = boards.filter(board => board === 0).length;
      const whiteStoneNum = boards.filter(board => board === 1).length;
      // end game
      if (
        blackStoneNum + whiteStoneNum === 64 ||
        blackStoneNum === 0 ||
        whiteStoneNum === 0
      ) {
        this.setState({ isFinished: true });
      } else {
        if (!this.canPutStone()) {
          if (this.state.isPassed) {
            this.setState({ isFinished: true });
          } else {
            alert("pass!");
            this.setState({
              tarn: prevState.tarn,
              isPassed: true
            });
          }
        } else {
          this.setState({ isPassed: false });
        }
        this.setState({ blackStoneNum, whiteStoneNum });
      }
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

  canPutStone(): boolean {
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
    return canPutBoards.filter(board => board === 1).length !== 0;
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

  handleStartGame() {
    this.setState({ tarn: 2 });
  }

  render() {
    const {
      boards,
      canPutBoards,
      whiteStoneNum,
      blackStoneNum,
      isFinished
    } = this.state;
    return (
      <div className="app">
        <Board
          boards={boards}
          setStone={this.setStone}
          canPutBoards={canPutBoards}
        />
        <p>{this.state.tarn === 0 ? "黒のターン" : "白のターン"}</p>
        <p>{`●x${blackStoneNum}  -  ○x${whiteStoneNum}`}</p>
        <EndGameModal
          isFinished={isFinished}
          handleStartGame={this.handleStartGame}
          whiteStoneNum={whiteStoneNum}
          blackStoneNum={blackStoneNum}
        />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
