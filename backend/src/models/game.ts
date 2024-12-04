type event = 'oneChoice' | 'draw' | 'winner' | 'loser' | 'end';
type gamer = Record<string, string>;

export class Game {
	private gamers: gamer = {};
	private events: Partial<Record<event, (gamerId: string, gamersChoices?: gamer) => void>> = {};

	private getWinner(): string | null {
		const choices = Object.values(this.gamers);

		if (choices.length !== 2) {
			throw new Error('Неправильное количество игроков');
		}

		const [player1Choice, player2Choice] = choices;

		if (player1Choice === player2Choice) {
			return null; // Ничья
		} else if (
			(player1Choice === 'камень' && player2Choice === 'ножницы') ||
			(player1Choice === 'ножницы' && player2Choice === 'бумага') ||
			(player1Choice === 'бумага' && player2Choice === 'камень')
		) {
			return Object.keys(this.gamers)[0]; // ID первого игрока
		} else {
			return Object.keys(this.gamers)[1]; // ID второго игрока
		}
	}

	private getEnemy(winnerId: string) {
		return Object.keys(this.gamers).find((userId) => userId !== winnerId);
	}

	run(userId: string | number, choice: string) {
		this.gamers[userId] = choice;
		const allChoosen = Object.keys(this.gamers).length >= 2;
		if (!allChoosen) {
			this.events?.oneChoice?.(userId as string);
			return;
		}

		const winnerId = this.getWinner();
		if (!winnerId) {
			this.events?.draw?.(userId as string, this.gamers);
			this.gamers = {};
			return;
		}

		this.events?.winner?.(winnerId);
		this.events?.loser?.(this.getEnemy(winnerId));
		this.events?.end?.(winnerId, this.gamers);
		this.gamers = {};
	}

	on(event: event, cb: (gamerId: string, gamersChoices?: gamer) => void) {
		this.events[event] = cb;
	}

	removeGamer(id: string | number) {
		delete this.gamers[id];
	}

	resetAllChoice() {
		Object.keys(this.gamers).forEach((gamer) => (this.gamers[gamer] = ''));
	}
}
