import { useGameStore } from '@/store/game';
import { Link } from 'react-router-dom';
import { GameBody } from './GameBody/GameBody';

export const Game = () => {
	const id = useGameStore((state) => state.id);
	const error = useGameStore((state) => state.error);
	const users = useGameStore((state) => state.users);

	if (!id) {
		return (
			<>
				<h1>Вы не подключены к игре</h1>
				<Link to="/">
					<button>Перейти к подключению</button>
				</Link>
			</>
		);
	}

	if (error) {
		return <h1>{error}</h1>;
	}

	if (!users) {
		return <h1>Нет данных</h1>;
	}

	return <GameBody />;
};
