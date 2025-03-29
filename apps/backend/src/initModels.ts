import { broadcastMessage } from './server';
import { Game } from './models/game';
import { Users } from './models/users';

export const game = new Game();

export const gamers = new Users();

game.on('oneChoice', (chooser) => {
	const users = gamers.choice(chooser);
	broadcastMessage({
		type: 'game',
		users,
	});
	gamers.clearText();
});

game.on('draw', (anyUserId, gamersChoices) => {
	const users = gamers.setAllText(`Ничья, оба выбрали - ${gamersChoices[anyUserId]}`);
	broadcastMessage({
		type: 'round',
		users,
	});
	gamers.clearText();
});

game.on('winner', (winnerId) => {
	gamers.win(winnerId);
});

game.on('loser', (loserId) => {
	gamers.lose(loserId);
});

game.on('end', (winnerId, choices) => {
	gamers.end(winnerId, choices);

	const users = gamers.getUsers();
	broadcastMessage({ type: 'round', users });
	gamers.clearText();
});
