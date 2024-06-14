/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const DI = {
	config: Symbol('config'),
	db: Symbol('db'),
	meilisearch: Symbol('meilisearch'),
	redis: Symbol('redis'),
	redisForPub: Symbol('redisForPub'),
	redisForSub: Symbol('redisForSub'),
	redisForTimelines: Symbol('redisForTimelines'),

	//#region Repositories
	usersRepository: Symbol('usersRepository'),
	notesRepository: Symbol('notesRepository'),
	announcementsRepository: Symbol('announcementsRepository'),
	announcementReadsRepository: Symbol('announcementReadsRepository'),
	appsRepository: Symbol('appsRepository'),
	avatarDecorationsRepository: Symbol('avatarDecorationsRepository'),
	noteHistoryRepository: Symbol('noteHistoryRepository'),
	noteFavoritesRepository: Symbol('noteFavoritesRepository'),
	noteThreadMutingsRepository: Symbol('noteThreadMutingsRepository'),
	noteReactionsRepository: Symbol('noteReactionsRepository'),
	noteUnreadsRepository: Symbol('noteUnreadsRepository'),
	pollsRepository: Symbol('pollsRepository'),
	pollVotesRepository: Symbol('pollVotesRepository'),
	userProfilesRepository: Symbol('userProfilesRepository'),
	userKeypairsRepository: Symbol('userKeypairsRepository'),
	userPendingsRepository: Symbol('userPendingsRepository'),
	userSecurityKeysRepository: Symbol('userSecurityKeysRepository'),
	userPublickeysRepository: Symbol('userPublickeysRepository'),
	userListsRepository: Symbol('userListsRepository'),
	userListFavoritesRepository: Symbol('userListFavoritesRepository'),
	userListMembershipsRepository: Symbol('userListMembershipsRepository'),
	userNotePiningsRepository: Symbol('userNotePiningsRepository'),
	userIpsRepository: Symbol('userIpsRepository'),
	usedUsernamesRepository: Symbol('usedUsernamesRepository'),
	followingsRepository: Symbol('followingsRepository'),
	followRequestsRepository: Symbol('followRequestsRepository'),
	instancesRepository: Symbol('instancesRepository'),
	emojisRepository: Symbol('emojisRepository'),
	driveFilesRepository: Symbol('driveFilesRepository'),
	driveFoldersRepository: Symbol('driveFoldersRepository'),
	metasRepository: Symbol('metasRepository'),
	mutingsRepository: Symbol('mutingsRepository'),
	renoteMutingsRepository: Symbol('renoteMutingsRepository'),
	blockingsRepository: Symbol('blockingsRepository'),
	swSubscriptionsRepository: Symbol('swSubscriptionsRepository'),
	hashtagsRepository: Symbol('hashtagsRepository'),
	abuseUserReportsRepository: Symbol('abuseUserReportsRepository'),
	abuseReportNotificationRecipientRepository: Symbol('abuseReportNotificationRecipientRepository'),
	registrationTicketsRepository: Symbol('registrationTicketsRepository'),
	authSessionsRepository: Symbol('authSessionsRepository'),
	accessTokensRepository: Symbol('accessTokensRepository'),
	signinsRepository: Symbol('signinsRepository'),
	pagesRepository: Symbol('pagesRepository'),
	pageLikesRepository: Symbol('pageLikesRepository'),
	galleryPostsRepository: Symbol('galleryPostsRepository'),
	galleryLikesRepository: Symbol('galleryLikesRepository'),
	moderationLogsRepository: Symbol('moderationLogsRepository'),
	clipsRepository: Symbol('clipsRepository'),
	clipNotesRepository: Symbol('clipNotesRepository'),
	clipFavoritesRepository: Symbol('clipFavoritesRepository'),
	antennasRepository: Symbol('antennasRepository'),
	promoNotesRepository: Symbol('promoNotesRepository'),
	promoReadsRepository: Symbol('promoReadsRepository'),
	relaysRepository: Symbol('relaysRepository'),
	channelsRepository: Symbol('channelsRepository'),
	channelFollowingsRepository: Symbol('channelFollowingsRepository'),
	channelFavoritesRepository: Symbol('channelFavoritesRepository'),
	registryItemsRepository: Symbol('registryItemsRepository'),
	webhooksRepository: Symbol('webhooksRepository'),
	systemWebhooksRepository: Symbol('systemWebhooksRepository'),
	adsRepository: Symbol('adsRepository'),
	passwordResetRequestsRepository: Symbol('passwordResetRequestsRepository'),
	retentionAggregationsRepository: Symbol('retentionAggregationsRepository'),
	rolesRepository: Symbol('rolesRepository'),
	roleAssignmentsRepository: Symbol('roleAssignmentsRepository'),
	flashsRepository: Symbol('flashsRepository'),
	flashLikesRepository: Symbol('flashLikesRepository'),
	userMemosRepository: Symbol('userMemosRepository'),
	bubbleGameRecordsRepository: Symbol('bubbleGameRecordsRepository'),
	reversiGamesRepository: Symbol('reversiGamesRepository'),
	//#endregion
};
