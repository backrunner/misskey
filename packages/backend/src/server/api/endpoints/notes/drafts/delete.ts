import { Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { NoteDraftService } from '@/core/NoteDraftService.js';
import { ApiError } from '../../../error.js';

export const meta = {
	tags: ['notes'],
	requireCredential: true,
	kind: 'write:notes:drafts',
	secure: true,
} as const;

export const paramDef = {
	type: 'object',
	properties: {},
	required: [],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> {
	constructor(
		private noteDraftService: NoteDraftService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const draft = await this.noteDraftService.getDraft(me);

			if (!draft) {
				throw new ApiError({
					message: 'No draft found for the current user.',
					code: 'NO_DRAFT_FOUND',
					id: 'no_draft_found',
				});
			}

			await this.noteDraftService.deleteDraft(me);

			return { success: true };
		});
	}
}
