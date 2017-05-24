import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
//Note that onClick={props.onClick()} would not work because it would call props.onClick immediately instead of passing it down.



class Board extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }

  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={()=>this.props.onClick(i)}
      />;
  }


  render() {

    // let test = this.state.squares.slice().map((item, i) => {
    //     return(
    //       <li key={i}>
    //         {i} : {item ? item : "null"}
    //       </li>
    //       )
    //     }
    // )

    // const status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
    // console.log(this.props.squares);
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div>

        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>

        {/* <div className="test">{test}</div> */}
      </div>
    );
  }
}



//Game
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //ignore the click if someone has already won the game or if a square is already filled

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([{
        squares: squares
      }]),

      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    console.log(history);
    console.log(current.squares);

    const moves = history.map((step,move) => {
      const desc = move ?
       "Move# :" + move :
      "Game Start";
      console.log(desc);
      return(
        <li key={move}>
          <a href="#">{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = winner + " Wins!"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O")
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
