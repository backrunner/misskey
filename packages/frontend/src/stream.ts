/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as Misskey from 'misskey-js';
import { markRaw } from 'vue';
import { wsOrigin } from '@@/js/config.js';
import { $i } from '@/account.js';
// TODO: No WebsocketモードでStreamMockが使えそう
//import { StreamMock } from '@/scripts/stream-mock.js';

// heart beat interval in ms
const HEART_BEAT_INTERVAL = 1000 * 10;

let stream: Misskey.IStream | null = null;
let timeoutHeartBeat: number | undefined;
let lastHeartbeatCall = 0;

export function useStream(): Misskey.IStream {
	if (stream) return stream;

	// TODO: No Websocketモードもここで判定
	stream = markRaw(new Misskey.Stream(wsOrigin, $i ? {
		token: $i.token,
	} : null));

	if (timeoutHeartBeat !== undefined) window.clearTimeout(timeoutHeartBeat);
	timeoutHeartBeat = window.setTimeout(heartbeat, HEART_BEAT_INTERVAL);

	// send heartbeat right now when last send time is over HEART_BEAT_INTERVAL
	document.addEventListener('visibilitychange', () => {
		if (
			!stream
			|| document.visibilityState !== 'visible'
			|| Date.now() - lastHeartbeatCall < HEART_BEAT_INTERVAL
		) return;
		heartbeat();
	});

	return stream;
}

function heartbeat(): void {
	if (!stream) {
		console.warn('Attempted to send heartbeat, but stream is not initialized');
		return;
	}

	try {
		stream.heartbeat();
		lastHeartbeatCall = Date.now();
	} catch (error) {
		console.error('Error sending heartbeat:', error);
	} finally {
		if (timeoutHeartBeat !== undefined) window.clearTimeout(timeoutHeartBeat);
		timeoutHeartBeat = window.setTimeout(heartbeat, HEART_BEAT_INTERVAL);
	}
}
