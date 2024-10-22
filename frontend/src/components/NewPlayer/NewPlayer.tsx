import { FormEventHandler, useState } from 'react';

export const NewPlayer = ({
	setSocket,
	id,
}: {
	setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
	id: number;
}) => {
	const [username, setUsername] = useState('');

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const socket = new WebSocket('ws://localhost:5000');

		socket.onopen = () => {
			const message = {
				event: 'connection',
				username,
				id,
			};
			socket.send(JSON.stringify(message));
		};

		setSocket(socket);
	};

	return (
		<form onSubmit={onSubmit}>
			<h2>Введите любой ник для подключения к игре и нажмите Enter</h2>
			<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
		</form>
	);
};
