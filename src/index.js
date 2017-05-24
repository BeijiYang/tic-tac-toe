import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
//Note that onClick={props.onClick()} would not work because it would call props.onClick immediately instead of passing it down.



class Board extends React.Component {

  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={()=>this.props.onClick(i)}
      />;
  }


  render() {

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
      stepNumber: 0,
      historyLocation:[],
    };
  }

  calculateWinner(squares) {
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

    const filled = squares.filter((item) => (item != null)).length;
    if(filled === 9) {
      return "NOBODY"
    }

    return null;
  }


  handleClick(i) {
    //按小格子的数字代号存储的历史
    const copyHistory = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = copyHistory[copyHistory.length - 1];
    const squares = current.squares.slice();

    //按坐标系存储的历史。之所以下面这一句不需要跟上面一样“+ 1”，是因为第0步时，上一种记录方式的初始状态是[object]，对象里是一个数组[null,...,null]，而这种是空的[]。
    const historyLocation = this.state.historyLocation.slice(0, this.state.stepNumber);
    historyLocation.push(this.convert(i));


    //ignore the click if someone has already won the game or if a square is already filled
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: copyHistory.concat([{
        squares: squares
      }]),
      stepNumber: copyHistory.length,
      xIsNext: !this.state.xIsNext,
      historyLocation: historyLocation,
    });
  }

  jumpTo(step){

    this.setState({
      stepNumber: step,
      // xIsNext: (step%2 === 0) ? true : false ,
      xIsNext: (step%2) ? false : true ,
    });
  }

  convert(i){
    var x=Math.floor(i/3)+1;
    var y=0;
    if((i+1)%3===0){
        y=3;
    }else{
        y=(i+1)%3;
    }
    return [x,y];
  }

  // reverse(moves){
  //   console.log(moves.reverse());
  //   return moves.reverse();
  // }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    const coordinate = this.state.historyLocation.slice();

// console.log(history);

    const moves = history.map((step,move) => {
      const desc = move ?
       "Move#" + move + "   (" + coordinate[move - 1] + ")" :
      "Game Start";
      console.log(desc);
      return(
        <li key={move}>
          <a href="#" ref="entry" onClick={() => this.jumpTo(move)}>{desc}</a>
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
          {/* <button onClick={() => this.reverse(moves)}>reverse</button> */}
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
