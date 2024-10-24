import { useGameStore, useSelectEnemy } from '@/store/game';
import { useGameActions } from './hooks';
import styles from './GameBody.module.scss';

export const GameBody = () => {
	const { onClick, id } = useGameActions();
	const disable = useGameStore((state) => state.disable);
	const users = useGameStore((state) => state.users);
	const enemy = useSelectEnemy(id);

	return (
		<>
			<h1 className={styles.title}>Rock - Paper - Scissors</h1>

			<div className={styles.choices}>
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

			<div className={styles.playerDisplay}>Ваш ник: {users?.[id]?.username} </div>
			<div className={styles.enemyDisplay}>Противник: {enemy?.username || ''} </div>
			<div className={styles.resultDisplay}>
				{!enemy && <p>Ожидайте второго игрока</p>}
				<p>{users?.[id]?.text || ''}</p>
			</div>

			<div className={styles.scoreDisplay}>
				Ваш счёт:
				<span className={styles.playerScoreDisplay}>{users?.[id]?.score || 0}</span>
			</div>

			<div className={styles.scoreDisplay}>
				Счёт противника:
				<span className={styles.enemyScoreDisplay}>{enemy?.score || 0}</span>
			</div>
		</>
	);
};
