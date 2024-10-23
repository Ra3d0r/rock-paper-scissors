export function sendError(reason: string) {
	return JSON.stringify({ type: 'error', reason });
}
