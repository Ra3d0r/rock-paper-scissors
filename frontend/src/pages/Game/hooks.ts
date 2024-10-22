import { useGameStore } from '../../store/game';
import { useWebSocketStore } from '../../store/websocket';

export const useHandleConnection = () => {
	const id = useGameStore((state) => state.id);
	const users = useGameStore((state) => state.users);
	const socket = useWebSocketStore((state) => state.webSocket);
	const setDisable = useGameStore((state) => state.setDisable);
	const disable = useGameStore((state) => state.disable);
	const error = useGameStore((state) => state.error);

	const onClick = (message: string) => {
		socket?.send(
			JSON.stringify({
				id,
				message,
				event: 'game',
			}),
		);
		setDisable(true);
	};

	return { users, error, disable, onClick, id };
};
