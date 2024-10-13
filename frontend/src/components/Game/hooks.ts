import { useEffect, useState } from 'react';

export interface User {
	id: number;
	username: string;
	score: number;
	text?: string;
}

export type Users = Record<string, User>;

export const useHandleConnection = (socket: WebSocket, id: number) => {
	const [users, setUsers] = useState<Users>();
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState(null);
	const [disable, setDisable] = useState(false);

	useEffect(() => {
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message);

			if (message.type === 'error') {
				setError(message.reason);
				return;
			}

			if (message.type === 'connection') {
				setUsers(message.users);
				return;
			}

			if (message.type === 'game') {
				setMessage(message.text);
				setDisable(message?.disable);
				return;
			}

			if (message.type === 'round') {
				setUsers(message.users);
				setDisable(message?.disable);
				setMessage(message.users[id].text);
				return;
			}
		};
		socket.onclose = () => {
			console.log('Socket закрыт');
		};
		socket.onerror = () => {
			console.log('Socket произошла ошибка');
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { users, error, message, disable };
};
