import { Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { NoteDraftService } from '@/core/NoteDraftService.js';
import { ApiError } from '@/server/api/error.js';

export const meta = {
	tags: ['notes'],
	kind: 'read:notes:drafts',
	requireCredential: true,
	allowGet: true,
	secure: true,

	res: {
		type: 'object',
		optional: false,
		nullable: true,
		properties: {
			id: {
				type: 'string',
				optional: false,
				nullable: false,
				format: 'id',
				example: 'xxxxxxxxxx',
			},
			userId: {
				type: 'string',
				optional: false,
				nullable: false,
				format: 'id',
			},
			text: {
				type: 'string',
				optional: true,
				nullable: true,
			},
			useCw: {
				type: 'boolean',
				optional: false,
				nullable: false,
			},
			cw: {
				type: 'string',
				optional: true,
				nullable: true,
			},
			visibility: {
				type: 'string',
				optional: false,
				nullable: false,
				enum: ['public', 'home', 'followers', 'specified'],
			},
			localOnly: {
				type: 'boolean',
				optional: false,
				nullable: false,
			},
			files: {
				type: 'string',
				optional: true,
				nullable: true,
			},
			poll: {
				type: 'string',
				optional: true,
				nullable: true,
			},
			visibleUserIds: {
				type: 'array',
				optional: true,
				nullable: true,
				items: {
					type: 'string',
					optional: false,
					nullable: false,
					format: 'id',
				},
			},
			quoteId: {
				type: 'string',
				optional: true,
				nullable: true,
				format: 'id',
			},
			reactionAcceptance: {
				type: 'string',
				optional: true,
				nullable: true,
				enum: ['likeOnly', 'likeOnlyForRemote', 'nonSensitiveOnly', 'nonSensitiveOnlyForLocalLikeOnlyForRemote', null],
			},
			updatedAt: {
				type: 'string',
				optional: false,
				nullable: false,
				format: 'date-time',
			},
		},
		required: ['id', 'userId', 'useCw', 'visibility', 'localOnly', 'updatedAt'],
	},

	errors: {
		noSuchDraft: {
			message: 'No such draft.',
			code: 'NO_SUCH_DRAFT',
			id: 'c2b3a333-2b64-4da8-8296-91e8335d4a1f',
		},
	},
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

			if (draft == null) {
				throw new ApiError(meta.errors.noSuchDraft);
			}

			return {
				id: draft.id,
				userId: draft.userId,
				text: draft.text,
				useCw: draft.useCw,
				cw: draft.cw,
				visibility: draft.visibility,
				visibleUserIds: draft.visibleUserIds,
				localOnly: draft.localOnly,
				reactionAcceptance: draft.reactionAcceptance,
				files: draft.files,
				poll: draft.poll,
				quoteId: draft.quoteId,
				updatedAt: draft.updatedAt.toISOString(),
			};
		});
	}
}
