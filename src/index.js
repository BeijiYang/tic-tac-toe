import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
    // console.log("e.target");
    console.log(e.target);
    // console.log("refs");
    // console.log(this.refs.entrying);
    // console.log(e.target.parentNode);
    // console.log(e.target.parentNode.parentNode);


    const lists = e.target.parentNode.parentNode.childNodes;
    for(let i=0; i<lists.length; i++) {
      const item = lists[i];
      item.childNodes[0]

      if(item.childNodes[0].classList.contains('back-active')){
          item.childNodes[0].classList.remove('back-active');
      }
      // if(item.childNodes[0].classList.contains('square')){
      //   continue;
      // }
          e.target.classList.add('back-active');
    };
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
    let aiMove = this.ai(currentSquares);
    console.log(aiMove);
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


  ai(arr) {

      var xIsNextqq = this.state.xIsNext;
      var player= xIsNextqq ? 'X' : 'O';
      var enemy = xIsNextqq ? 'O' : 'X';
      var loacation=arr.map(function(item,index){
          if(item===null){
            // console.log(index);
              return index;
          }
      }).filter(function(item){
          return item!==undefined;
      });
      console.log(loacation);

      var oCalc={};
      // for(var i=0;i<arr.length;i++){
          for(let j=0;j<loacation.length;j++){
              var index=loacation[j];
              switch(index){
                  case 0:
                  case 2:
                  case 6:
                  case 8:
                    oCalc['loacation'+index]=judgeConner(index);
                    break;
                  case 1:
                  case 3:
                  case 5:
                  case 7:
                    oCalc['loacation'+index.toString()]=judgeSide(index);
                    break;
                  case 4:
                    oCalc['loacation'+index.toString()]=judgeCenter(index);
                    break;
              }
          }
      // }

        // var oCalc = { loacation3: 3000,
        //               loacation5: 500,
        //               loacation7: 50 }

      console.log(JSON.stringify(oCalc));


      function judgeConner(index) {
        switch (index) {
          case 0:
          return conner(1,2,3,6,4,8);

          case 2:
          return conner(0,1,5,8,4,6);

          case 6:
          return conner(0,3,7,8,2,4);

          case 8:
          return conner(2,5,6,7,0,4);

            break;
          default:
        }
      }
      function judgeSide(index) {
        switch (index) {
          case 1:
          return side(4,7,0,2);

          case 3:
          return side(0,6,4,5);

          case 5:
          return side(2,8,3,4);

          case 7:
          return side(6,8,1,4);

            break;
          default:
        }
      }
      function judgeCenter(index) {
        return center(3,5,1,7,0,8,2,6)
      }

      function side(a,b,c,d) {
        if ((arr[a]===player && arr[b]===player) || (arr[c]===player && arr[d]===player)) {
          return 10000;
        }else if((arr[a]===enemy && arr[b]===enemy) || (arr[c]===enemy && arr[d]===enemy)) {
          return 1000;
        }else if ((arr[a]===player || arr[b]===player) || (arr[c]===player || arr[d]===player)) {
          return 100;
        }else if ((arr[a]===enemy || arr[b]===enemy) || (arr[c]===enemy || arr[d]===enemy)) {
          return -10;
        }else {
          return 0;
        }
      }

      function conner(a,b,c,d,e,f) {
        if ((arr[a]===player && arr[b]===player) || (arr[c]===player && arr[d]===player) || (arr[e]===player && arr[f]===player)) {
          return 10000;
        }else if((arr[a]===enemy && arr[b]===enemy) || (arr[c]===enemy && arr[d]===enemy)|| (arr[e]===enemy && arr[f]===enemy)) {
          return 1000;
        }else if ((arr[a]===player || arr[b]===player) || (arr[c]===player || arr[d]===player)|| (arr[e]===player || arr[f]===player)) {
          return 100;
        }else if ((arr[a]===enemy || arr[b]===enemy) || (arr[c]===enemy || arr[d]===enemy) || (arr[e]===enemy || arr[f]===enemy)) {
          return -10;
        }else {
          return 0;
        }
      }

      function center(a,b,c,d,e,f,g,h) {
        if ((arr[a]===player && arr[b]===player) || (arr[c]===player && arr[d]===player) || (arr[e]===player && arr[f]===player) || (arr[g]===player && arr[h]===player)) {
          return 10000;
        }else if((arr[a]===enemy && arr[b]===enemy) || (arr[c]===enemy && arr[d]===enemy) || (arr[e]===enemy && arr[f]===enemy) || (arr[g]===enemy && arr[h]===enemy)) {
          return 1000;
        }else if ((arr[a]===player || arr[b]===player) || (arr[c]===player || arr[d]===player) || (arr[e]===player || arr[f]===player) || (arr[g]===player || arr[h]===player)) {
          return 100;
        }else if ((arr[a]===enemy || arr[b]===enemy) || (arr[c]===enemy || arr[d]===enemy) || (arr[e]===enemy || arr[f]===enemy) || (arr[g]===enemy || arr[h]===enemy)) {
          return -10;
        }else {
          return 0;
        }
      }


      const largest={
          index:-1,
          value:-100
      };

      for(var item in oCalc){
          if(oCalc[item]>largest.value){
              largest.index=parseInt(item.replace('loacation',''));
              largest.value=oCalc[item];
          }
      }

      console.log([player,JSON.stringify(largest)]);

      return largest.index;
    }


  // ai(arr);
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // console.log(this.ai(current.squares));
    const winner = this.calculateWinner(current.squares)[0];
    const winCase = this.calculateWinner(current.squares)[1];
    const coordinate = this.state.historyLocation.slice();
    const reversedHistory = history.slice().reverse();
    const reversedCoordinate = coordinate.slice().reverse();
    // const historyArr
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
          <a href="#" ref="entry" onClick={this.jumpTo.bind(this,move)}>{desc}</a>
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
          <button onClick={() => this.toggleSortingOrder()}>reverse</button>
          <button onClick={() => this.reset()}>reset</button>
          <button onClick={() => this.callAI(current.squares)}>AI</button>
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


/*
只考虑一条线路上的情况
线路上 有己方的二子连线，这手棋价值是10000。
线路上 有对方的二子连线，这手棋价值可算作1000。
线路上 只有己方一个子，价值算作100。
线路上 只有对方的一个子,它的权重是-10。

线路一个子都没有的情况，先手就定义为0吧——这里又有坑了。

实际上的情况是，一手棋包含了2-4条线路。综合各条线路的判断下来。累加的权重就是这手棋的价值。


角位是2,4,6,8。边位是1,3,5,7。中心位置为4。
根据不同的情况返回不同的位置到对象oCalc中。（作为测试，可以把oCalc作为ai函数的return值）。

角位，需要判定的有3条线路（横竖斜）
边位，需要判断2条线路（横竖）
中心位置需要判断4条线路：（横竖撇捺）
接下来就是在各个函数里var一个value，一个个对arr进行判定。


*/


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
