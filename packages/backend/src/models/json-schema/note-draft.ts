export const packedNoteDraftSchema = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			optional: false, nullable: false,
			format: 'id',
			example: 'xxxxxxxxxx',
		},
		userId: {
			type: 'string',
			optional: false, nullable: false,
			format: 'id',
		},
		text: {
			type: 'string',
			optional: true, nullable: true,
		},
		useCw: {
			type: 'boolean',
			optional: false, nullable: false,
		},
		cw: {
			type: 'string',
			optional: true, nullable: true,
		},
		visibility: {
			type: 'string',
			optional: false, nullable: false,
			enum: ['public', 'home', 'followers', 'specified'],
		},
		localOnly: {
			type: 'boolean',
			optional: false, nullable: false,
		},
		files: {
			type: 'string',
			optional: true, nullable: true,
		},
		poll: {
			type: 'string',
			optional: true, nullable: true,
		},
		visibleUserIds: {
			type: 'array',
			optional: true, nullable: true,
			items: {
				type: 'string',
				optional: false, nullable: false,
				format: 'id',
			},
		},
		quoteId: {
			type: 'string',
			optional: true, nullable: true,
			format: 'id',
		},
		reactionAcceptance: {
			type: 'string',
			optional: true, nullable: true,
			enum: ['likeOnly', 'likeOnlyForRemote', 'nonSensitiveOnly', 'nonSensitiveOnlyForLocalLikeOnlyForRemote', null],
		},
		updatedAt: {
			type: 'string',
			optional: false, nullable: false,
			format: 'date-time',
		},
	},
	required: ['id', 'userId', 'useCw', 'visibility', 'localOnly', 'updatedAt'],
} as const;
