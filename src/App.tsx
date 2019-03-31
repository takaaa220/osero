import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "./components/Board";

type Stone = 0 | 1 | null;

export interface AppProps {}

export interface AppState {
  tarn: 0 | 1;
  boards: Stone[];
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

  setStone(i: any) {
    const boards = this.state.boards;
    if (!boards[i]) {
      boards[i] = this.state.tarn;
      this.setState({
        boards,
        tarn: this.state.tarn === 0 ? 1 : 0
      });
    }
  }

  initialize(): Stone[] {
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
        <Board boards={boards} setStone={this.setStone} />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
