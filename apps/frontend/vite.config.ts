import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({ mode }) => {
	const VITE_SERVER_PORT = Number(process.env.VITE_PORT || 5173);
	const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
	const BACKEND_PORT = process.env.BACKEND_PORT;

	return {
		plugins: [react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			port: VITE_SERVER_PORT,
			proxy: {
				'/ws': {
					target: `ws://${BACKEND_HOST}:${BACKEND_PORT}`,
					ws: true,
				},
			},
		},
	};
});
