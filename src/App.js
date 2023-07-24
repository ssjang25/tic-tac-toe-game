import { useState } from "react"
import React from "react"

//export default tells index.js to use it as main function
export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //Keeps track of what move the user is viewing, default 0
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentBoard = history[currentMove];

  function handlePlay(nextSquares){
    //If user goes back in time and make a new move, it only keeps history up to that point. Appends nextSquares
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
    //
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }
  
  //maps history into React buttons that allows jumping to past moves
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0){
      description = 'Go to move #' + move;
    }
    else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  //passes props down to Board so it can use them 
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentBoard} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({xIsNext, squares, onPlay}) {
  const winner = calculateWinner(squares);
  let status;

  if (winner){
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i){
    //checks if player clicks already occupied square, or there is winner
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    const newSquares = squares.slice();
    if (xIsNext){
      newSquares[i] = 'X';
    }
    else {
      newSquares[i] = 'O';
    }
    onPlay(newSquares);
  }
  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </div>
  )
}

//Square accepts a prop, value, that is passed to Board
//Use {} to escape into JS
function Square({value, onSquareClick}){
  //className and onClick are props of button
  return (
  <button
  className="square"
  onClick={onSquareClick}
  >
    {value}
  </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
