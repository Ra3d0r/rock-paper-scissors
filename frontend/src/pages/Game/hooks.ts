import { useGameStore } from '@/store/game';
import { useWebSocketStore } from '@/store/websocket';

export const useGameActions = () => {
	const id = useGameStore((state) => state.id);
	const socket = useWebSocketStore((state) => state.webSocket);
	const setDisable = useGameStore((state) => state.setDisable);

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

	return { onClick, id };
};
