import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AI from "./ai";

function Square(props) {
  return (
    <button className={props.winCase} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
//Note that onClick={props.onClick()} would not work because it would call props.onClick immediately instead of passing it down.



class Board extends React.Component {


  renderSquare(i) {
      const winCase = this.props.winCase;
      if(winCase){
        for(let j=0; j<winCase.length; j++) {
          if(winCase[j] === i)
          return <Square
            value={this.props.squares[i]}
            onClick={()=>this.props.onClick(i)}
            winCase={"square bold"}
            />;
        }
      }
      return <Square
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
        winCase={"square"}
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
      ascendingOrder: true,
    };
    // this.jumpTo = this.jumpTo.bind(this);
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
        // console.log(lines[i]);
        return [squares[a],lines[i]];
      }
    }

    const filled = squares.filter((item) => (item != null)).length;
    if(filled === 9) {
      return ["NOBODY"];
    }

    return [null];
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
    if (this.calculateWinner(squares)[0] || squares[i]) {
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

  jumpTo(step,e){
    //高亮当前选中项
    // console.log(e.target);
    const lists = e.target.parentNode.parentNode.childNodes;
    for(let i=0; i<lists.length; i++) {
      const item = lists[i];

      if(item.childNodes[0].classList.contains('back-active')){
          item.childNodes[0].classList.remove('back-active');
      }
      // if(item.childNodes[0].classList.contains('square')){
      //   continue;
      // }
          e.target.classList.add('back-active');
    };

    //穿越
    this.setState({
      stepNumber: step,
      // xIsNext: (step%2 === 0) ? true : false ,
      xIsNext: (step%2) ? false : true ,
    });
  }

  convert(i){
    const x=Math.floor(i/3)+1;
    let y=0;
    if((i+1)%3===0){
        y=3;
    }else{
        y=(i+1)%3;
    }
    return [x,y];
  }

  toggleSortingOrder() {
    this.setState({
      ascendingOrder: !this.state.ascendingOrder,
    });
  }

  reset() {
    this.setState({
      stepNumber: 0,
      xIsNext: true ,
      history: this.state.history.slice(0,1),
    });
  }

  callAI(currentSquares) {
    const idCheck = this.state.xIsNext;
    let aiMove = AI(currentSquares,idCheck);
    // console.log(aiMove);

    //按小格子的数字代号存储的历史
    const copyHistory = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = copyHistory[copyHistory.length - 1];
    const squares = current.squares.slice();

    //按坐标系存储的历史。之所以下面这一句不需要跟上面一样“+ 1”，是因为第0步时，上一种记录方式的初始状态是[object]，对象里是一个数组[null,...,null]，而这种是空的[]。
    const historyLocation = this.state.historyLocation.slice(0, this.state.stepNumber);
    historyLocation.push(this.convert(aiMove));


    //ignore the click if someone has already won the game or if a square is already filled
    if (this.calculateWinner(squares)[0] || squares[aiMove]) {
      return;
    }

    squares[aiMove] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: copyHistory.concat([{
        squares: squares
      }]),
      stepNumber: copyHistory.length,
      xIsNext: !this.state.xIsNext,
      historyLocation: historyLocation,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // console.log(this.ai(current.squares));
    const winner = this.calculateWinner(current.squares)[0];
    const winCase = this.calculateWinner(current.squares)[1];
    const coordinate = this.state.historyLocation.slice();
    const reversedHistory = history.slice().reverse();
    const reversedCoordinate = coordinate.slice().reverse();
    // console.log("winCase:"+winCase);
    // console.log(history);
    // console.log(reversedHistory);
    // console.log("positive");
    // console.log(coordinate);
    // console.log("coordinate[-1]:   "+coordinate[-1]);
    // console.log("coordinate[0]:    "+coordinate[0]);
    // console.log("coordinate[1]:    "+coordinate[1]);
    // console.log("negative");
    // console.log(reversedCoordinate);
    // console.log("reversedCoordinate[-1]:   "+reversedCoordinate[-1]);
    // console.log("reversedCoordinate[0]:    "+reversedCoordinate[0]);
    // console.log("reversedCoordinate[1]:    "+reversedCoordinate[1]);

    const moves = history.slice().map((step,move) => {
      const desc = move ?
      "Move#" + move + "   (" + coordinate[move - 1] + ")" :
      "Game Start";
      return(
        <li key={move}>
          <a href="#" className={move} ref="entry" onClick={this.jumpTo.bind(this,move)}>{desc}</a>
        </li>
      );
    });

    const reversedMoves =reversedHistory.map((step,move) => {

      const reversedMove = reversedHistory.length-1 - move; //[0,1,2,3,4] => [4,3,2,1,0]
      const desc = (reversedMove) ?
      "Move#" + (reversedMove) + "   (" + reversedCoordinate[move] + ")" :
      "Game Start";

      return(
        <li key={move}>
          <a href="#" ref="entry" onClick={this.jumpTo.bind(this,reversedMove)}>{desc}</a>
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
            winCase={winCase}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="menu" onClick={() => this.toggleSortingOrder()}>reverse</button>
          <button className="menu" onClick={() => this.reset()}>reset</button>
          <button className="menu" id="AI" onClick={() => this.callAI(current.squares)}>AI</button>
          {
            this.state.ascendingOrder ?
            <ol>{moves}</ol> :
            <ul>{reversedMoves}</ul>
          }
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
