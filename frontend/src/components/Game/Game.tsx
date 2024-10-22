import { useHandleConnection, Users } from './hooks';

const getEnemy = (users: Users, id: number) =>
	Object.values(users).filter((user) => user.id !== id)[0];

export const Game = ({ socket, id }: { socket: WebSocket; id: number }) => {
	const { users, error, disable, onClick } = useHandleConnection(socket, id);

	if (error) {
		return <h1>{error}</h1>;
	}

	if (!users) {
		return <h1>Нет данных</h1>;
	}

	return (
		<>
			<h1>Rock - Paper - Scissors</h1>

			<div className="choices">
				<button onClick={() => onClick('камень')} disabled={disable}>
					👊
				</button>
				<button onClick={() => onClick('бумага')} disabled={disable}>
					✋
				</button>
				<button onClick={() => onClick('ножницы')} disabled={disable}>
					✌
				</button>
			</div>

			<div id="playerDisplay">Ваш ник: {users?.[id].username} </div>
			<div id="enemyDisplay">Противник: {getEnemy(users, id)?.username || ''} </div>
			<div id="resultDisplay">
				{getEnemy(users, id) ? '' : 'Ожидайте второго игрока'}
				{users?.[id]?.text || ''}
			</div>

			<div className="scoreDisplay">
				Ваш счёт:
				<span id="playerScoreDisplay">{users?.[id]?.score || 0}</span>
			</div>

			<div className="scoreDisplay">
				Счёт противника:
				<span id="enemyScoreDisplay">{getEnemy(users, id)?.score || 0}</span>
			</div>
		</>
	);
};
