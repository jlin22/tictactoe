import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	const winningColors = {backgroundColor: '#ff81dd'};
	const otherColors = {};
	const color = props.winning ? winningColors : otherColors
	return (
		<button style={color} className="square" onClick={props.onClick}>
		{props.value}
		</button>
	);
}

class Board extends React.Component {
	handleClick(i) {
		const squares = this.state.squares.slice();
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			squares: squares,
			xIsNext: !this.state.xIsNext
		});
	}

  renderSquare(i) {
		const winning = this.props.winningSquares ? this.props.winningSquares.includes(i) : false
    return (
		<Square 
		value={this.props.squares[i]}
		onClick={() => this.props.handleClick(i)}
		winning={winning}
		/>);
  }

  render() {
		var returnJSX = []
		for (var i = 0; i < 3; i++) {
			var squares = [];
			for (var j = 0; j < 3; j++) {
				squares.push(this.renderSquare(3 * i + j));
			}
			returnJSX.push(<div className="board-row">{squares}</div>);
		}
		return <div>{returnJSX}</div>;		
/*
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
      </div>
    ); */

  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			xIsNext: true
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i])
			return;
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

  render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winningSquares = calculateWinner(current.squares);
		const winner = winningSquares ? current.squares[0] : null;
		const draw = isDraw(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ? 
				'Go to move #' + move:
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner)
			status = "Winner: " + winner;
		else if (draw)
			status = "Draw";
		else
			status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board 
						squares={current.squares}
						handleClick={(i) => this.handleClick(i)}
						winningSquares={winningSquares}
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

function isDraw(squares) {
	var completelyFull = true;	
	for (var i = 0; i < squares.length && completelyFull; i++)
		completelyFull &= (squares[i] !== null)
	return completelyFull && (calculateWinner != null);	
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
	
	for (var i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c])
			return [a, b, c];
	}
	return null;
}
