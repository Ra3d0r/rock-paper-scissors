interface User {
	id: number;
	username: string;
	score: number;
	text?: string;
}

type UsersType = Record<string, User>;

export class Users {
	private users: UsersType = {};

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
		const enemyId = Object.keys(this.users).filter((user) => Number(user) !== Number(chooserId))[0];
		this.users[enemyId].text = 'Противник сделал ход';
		this.users[chooserId].text = 'Ожидайте хода противника';
		return this.users;
	}

	draw() {
		Object.keys(this.users).forEach((user) => (this.users[user].text = 'Ничья'));
		return this.users;
	}

	win(winnerId: string) {
		this.users[winnerId].score = this.users[winnerId].score + 1;
		this.users[winnerId].text = 'Победа';
	}

	lose(loserId: string) {
		this.users[loserId].text = 'Проигрыш';
	}

	getUsers() {
		return this.users;
	}

	removeUser(id: string | number) {
		delete this.users[id];
	}
}
