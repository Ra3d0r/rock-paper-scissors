import './App.css';

function App() {
	return (
		<>
			<h1>Rock - Paper - Scissors</h1>

			<div className="choices">
				<button>👊</button>
				<button>✋</button>
				<button>✌</button>
			</div>

			<div id="playerDisplay">PLAYER: </div>
			<div id="computerDisplay">COMPUTER: </div>
			<div id="resultDisplay"></div>

			<div className="scoreDisplay">
				Player Score:
				<span id="playerScoreDisplay">0</span>
			</div>

			<div className="scoreDisplay">
				Computer Score:
				<span id="computerScoreDisplay">0</span>
			</div>
		</>
	);
}

export default App;
