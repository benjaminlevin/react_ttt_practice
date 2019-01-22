import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
*****************************
  //react component: SQUARE
*****************************
*/

function Square(props) {
  return (
    <button 
    className="square" 
    onClick={props.onClick} 
    style={{background: props.color}}> 
      {props.value}
    </button>
  );
}

/*
*****************************
  //react component: BOARD
*****************************
*/

  class Board extends React.Component {

   renderSquare(i) {
    return (
        <Square 
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          color={this.props.color[i]}
          // use handle[Event] for methods that handle events
          // use on[Event] for props that handle events
        />
      );
    }

    //using two loops to render board, versus hardcoding
    renderRow(c, m) { // variables: (c)olumns, (m)ultiplier
      let row = Array(c).fill(null);
      for (let i = 0; i < c; i++){
        row[i] = this.renderSquare(i + m);
      }
      return <div key={m} className="board-row">{row}</div>
    }
    renderRows(c, r) { // variables: (c)olumns, (r)ows
      let rows = Array(r).fill(null);
      for (let i = 0; i < r; i++) {
        rows[i] = this.renderRow(c, i*r);
      }
      return rows;
    }

    render() {
      return (
        <div>
          {this.renderRows(3, 3)}
        </div> 
      );
    }
  }
  
/*
*****************************
  //react component: GAME
*****************************
*/

  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          color: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        toggleHistory: true,
        toggleOrder: true,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const colors = Array(9).fill(null);
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          color: colors
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    changeOrder (i) {
      this.setState({
        toggleOrder: !this.state.toggleOrder,
      })
    };

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      // non-concise way to establish locations for move history
      const location = Array(9).fill(null);
      for (var x = 0; x < history.length; x++){
        let currentBoard = history[x].squares;
        if (x > 0){
          let lastBoard = history[x-1].squares;
          for (var y = 0; y < currentBoard.length; y++){
            if (lastBoard[y] !== currentBoard[y]){
              if (y <= 2){
                location[x] = [(y + 1), 1]
              }
              if (y <= 5 && y > 2){
                location[x] = [(y - 2), 2]
              }
              if (y <= 8 && y > 5){
                location[x] = [(y - 5), 3]
              }
            }
          }
        }
      }
      
      // for bolding current move 
      var currentMove = 9;
      current.squares.forEach(function(x) {
        if (x === null){
          currentMove -= 1;
        }
      });

      const moves = history.map((step, move) => {
        const desc = move ?
        'Move #' + move + ' (co: ' + location[move][0] + ' • ro: ' + location[move][1] + ')':
        'Game Start';
        //set bold button text for currently selected move
        if (move === currentMove){
          return(
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>
                <b>{desc}</b>
              </button>
            </li>
          );
        }
        return(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        );
      });

      // simple toggle ascending/descending feature for move history
      // didn't do this in a very 'react' way -- button in return()
      if (this.state.toggleOrder === true){
        moves.reverse();
      }

      let status;
      if (winner) {
        status = 'Winner: ' + winner.winner;
        for (let i = 0; i < winner.success.length; i++) {
          current.color[winner.success[i]] = 'green';
        }
      }
      else if (current.squares.includes(null)){
        status = 'Next player: ' + 
        (this.state.xIsNext ? 'X' : 'O');
      }
      else {
        status = 'Draw!'
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              color={current.color}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ul>{moves}</ul>
            <ul>
              <button onClick={(i) => this.changeOrder(i)}>reverse order</button>
            </ul>
          </div>
        </div>
      );
    }
  }
  
/*
*****************************
  // RENDER
*****************************
*/

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
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] 
        && squares[a] === squares[c]) {
          return {winner: squares[a], success: lines[i]};
      }
    }
    return null;
  } 