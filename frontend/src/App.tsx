import { useRef, useState } from 'react';
import './App.css';
import { Game } from './components/Game/Game';
import { NewPlayer } from './components/NewPlayer/NewPlayer';

function App() {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const idRef = useRef(Date.now());

	if (!socket) {
		return <NewPlayer setSocket={setSocket} id={idRef.current} />;
	}
	return <Game socket={socket} id={idRef.current} />;
}

export default App;
