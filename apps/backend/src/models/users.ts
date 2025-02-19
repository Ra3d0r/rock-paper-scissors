interface User {
	id: number;
	username: string;
	score: number;
	text?: string;
}

type UsersType = Record<string, User>;

export class Users {
	private users: UsersType = {};

	private getEnemy(id: string) {
		return Object.keys(this.users).find((userId) => Number(userId) !== Number(id));
	}

	clearText() {
		Object.keys(this.users).forEach((user) => (this.users[user].text = ''));
	}

	add({ id, username }: { id: number; username: string }): Promise<UsersType> {
		return new Promise((resolve, reject) => {
			if (Object.keys(this.users).length >= 2) {
				reject('Уже есть 2 игрока');
				return;
			}

			this.users[id] = {
				id,
				username,
				score: 0,
			};
			resolve(this.users);
		});
	}

	choice(chooserId: string) {
		const enemyId = this.getEnemy(chooserId);
		this.users[enemyId].text = 'Противник сделал ход';
		this.users[chooserId].text = 'Ожидайте хода противника';
		return this.users;
	}

	setAllText(text: string) {
		Object.keys(this.users).forEach((user) => (this.users[user].text = text));
		return this.users;
	}

	win(winnerId: string) {
		this.users[winnerId].score = this.users[winnerId].score + 1;
		this.users[winnerId].text = 'Победа';
	}

	lose(loserId: string) {
		this.users[loserId].text = 'Проигрыш';
	}

	end(winnerId: string, choices: Record<string, string>) {
		const enemyId = this.getEnemy(winnerId);
		const winner = this.users[winnerId];
		const enemy = this.users[enemyId];
		winner.text += `<br/>${winner.username}: ${choices[winnerId]}, ${enemy.username}: ${choices[enemyId]}`;
		enemy.text += `<br/>${enemy.username}: ${choices[enemyId]}, ${winner.username}: ${choices[winnerId]}`;
	}

	getUsers() {
		return this.users;
	}

	removeUser(id: string | number) {
		delete this.users[id];
	}

	resetAllScore() {
		Object.keys(this.users).forEach((user) => (this.users[user].score = 0));
	}

	getCountUsers() {
		return Object.keys(this.users).length;
	}
}
