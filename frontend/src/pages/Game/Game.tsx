import { useSelectEnemy } from '../../store/game';
import { useHandleConnection } from './hooks';

export const Game = () => {
	const { users, error, disable, onClick, id } = useHandleConnection();
	const enemy = useSelectEnemy(id);

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

			<div id="playerDisplay">Ваш ник: {users?.[id]?.username} </div>
			<div id="enemyDisplay">Противник: {enemy?.username || ''} </div>
			<div id="resultDisplay">
				<p>{enemy ? '' : 'Ожидайте второго игрока'}</p>
				<p>{users?.[id]?.text || ''}</p>
			</div>

			<div className="scoreDisplay">
				Ваш счёт:
				<span id="playerScoreDisplay">{users?.[id]?.score || 0}</span>
			</div>

			<div className="scoreDisplay">
				Счёт противника:
				<span id="enemyScoreDisplay">{enemy?.score || 0}</span>
			</div>
		</>
	);
};
