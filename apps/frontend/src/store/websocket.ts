import { create } from 'zustand';

type State = {
	webSocket: WebSocket | null;
};

type Actions = {
	setWebSocket: (wb: WebSocket) => void;
};

export const useWebSocketStore = create<State & Actions>((set) => ({
	webSocket: null,
	setWebSocket: (webSocket) => set({ webSocket }),
}));
