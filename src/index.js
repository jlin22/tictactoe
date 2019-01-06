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
  }
}

function Order(props) {
	const desc = props.ascending ? "Ascending" : "Descending";
	return (
		<button className="order">{desc}</button>
	)
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			xIsNext: true,
			actions: [
				null
			],
			ascending: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const actions = this.state.actions.slice(0, this.state.stepNumber + 1);
		if (calculateWinner(squares) || squares[i])
			return;
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			actions: actions.concat(i),
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
		const actions = this.state.actions;

		const moves = history.map((step, move) => {
			const action = fmtAction(oneToTwoDims(actions[move]));
			const desc = move ? 
				'Go to move #' + move:
				'Go to game start';
			const bold = (move === this.state.stepNumber) ? {fontWeight: 'bold'} : {};
			return (
				<li key={move}>
					<button style={bold} onClick={() => this.jumpTo(move)}>{action} {desc}</button>
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
					<Order ascending={this.state.ascending}/>
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

function oneToTwoDims(val) {
	return val != null ? [Math.floor(val / 3), val % 3] : null;
}

function fmtAction(action) {
	return action != null ? "(" + action[0] + ", " + action[1] + ") " : null;
}
