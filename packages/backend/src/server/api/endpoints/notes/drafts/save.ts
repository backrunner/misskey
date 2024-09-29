import { Injectable } from '@nestjs/common';
import ms from 'ms';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { noteVisibilities } from '@/types.js';
import { NoteDraftService } from '@/core/NoteDraftService.js';

export const meta = {
	tags: ['notes'],
	requireCredential: true,
	kind: 'write:notes:drafts',
	secure: true,
	limit: {
		duration: ms('1hour'),
		max: 1000,
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		id: { type: 'string', format: 'misskey:id', nullable: true },
		text: { type: 'string', nullable: true },
		useCw: { type: 'boolean', default: false },
		cw: { type: 'string', nullable: true },
		visibility: { type: 'string', enum: noteVisibilities, default: 'public' },
		visibleUserIds: { type: 'array', items: { type: 'string', format: 'misskey:id' } },
		localOnly: { type: 'boolean', default: false },
		reactionAcceptance: { type: 'string', nullable: true, enum: [null, 'likeOnly', 'likeOnlyForRemote', 'nonSensitiveOnly', 'nonSensitiveOnlyForLocalLikeOnlyForRemote'] },
		files: { type: 'string', nullable: true },
		poll: { type: 'string', nullable: true },
		quoteId: { type: 'string', format: 'misskey:id', nullable: true },
	},
	required: [],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> {
	constructor(
		private noteDraftService: NoteDraftService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const draft = await this.noteDraftService.saveDraft(me, {
				text: ps.text,
				useCw: ps.useCw,
				cw: ps.cw,
				visibility: ps.visibility,
				visibleUserIds: ps.visibleUserIds,
				localOnly: ps.localOnly,
				reactionAcceptance: ps.reactionAcceptance,
				files: ps.files,
				poll: ps.poll,
				quoteId: ps.quoteId,
			});

			return { id: draft.id };
		});
	}
}
