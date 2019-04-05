import * as React from "react";
import * as ReactModal from "react-modal";

interface EndGameModalProps {
  isFinished: boolean;
  handleStartGame: any;
  whiteStoneNum: number;
  blackStoneNum: number;
}

const customStyles = {
  content: {
    height: "200px",
    width: "300px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute"
  }
};

const EndGameModal: React.SFC<EndGameModalProps> = props => {
  return (
    <ReactModal
      className="end-game-modal"
      isOpen={props.isFinished}
      style={customStyles}
    >
      <h2 className="end-game-modal__winner">
        {props.whiteStoneNum === props.blackStoneNum
          ? "Draw"
          : props.whiteStoneNum > props.blackStoneNum
          ? "白の勝ち!"
          : "黒の勝ち!"}
      </h2>
      <button
        className="end-game-modal__button"
        onClick={props.handleStartGame}
      >
        もう一度
      </button>
    </ReactModal>
  );
};

export default EndGameModal;
