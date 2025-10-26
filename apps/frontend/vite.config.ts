import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({ mode }) => {
	const PORT = Number(process.env.VITE_PORT || 5173);

	return {
		plugins: [react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			port: PORT,
		},
		define: {
			'import.meta.env.WS_PORT': JSON.stringify(process.env.WS_PORT),
		},
	};
});
