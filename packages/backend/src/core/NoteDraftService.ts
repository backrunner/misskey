import { Inject, Injectable } from '@nestjs/common';
import { DI } from '@/di-symbols.js';
import type { NoteDraftsRepository } from '@/models/_.js';
import type { MiUser } from '@/models/User.js';
import { MiNoteDraft } from '@/models/NoteDraft.js';
import { bindThis } from '@/decorators.js';
import { MemoryKVCache } from '@/misc/cache.js';

import { IdService } from './IdService.js';

@Injectable()
export class NoteDraftService {
	private draftCache: MemoryKVCache<MiNoteDraft>;

	constructor(
		@Inject(DI.noteDraftsRepository)
		private noteDraftsRepository: NoteDraftsRepository,
		private idService: IdService,
	) {
		this.draftCache = new MemoryKVCache<MiNoteDraft>(1000 * 60 * 30); // 30 minutes cache
	}

	@bindThis
	public async saveDraft(user: MiUser, data: Partial<MiNoteDraft>): Promise<MiNoteDraft> {
		let draft = await this.getDraft(user);

		const draftData: Partial<MiNoteDraft> = {
			id: draft?.id ?? this.idService.gen(),
			text: data.text ?? null,
			useCw: data.useCw ?? false,
			cw: data.cw ?? null,
			visibility: data.visibility ?? 'public',
			localOnly: data.localOnly ?? false,
			files: data.files ?? null,
			poll: data.poll ?? null,
			visibleUserIds: data.visibleUserIds ?? [],
			quoteId: data.quoteId ?? null,
			reactionAcceptance: data.reactionAcceptance ?? null,
			updatedAt: new Date(),
		};

		if (draft) {
			await this.noteDraftsRepository.update(draft.id, draftData);
		} else {
			draft = this.noteDraftsRepository.create({
				...draftData,
				userId: user.id,
			});
			await this.noteDraftsRepository.save(draft);
		}

		// Update cache
		this.draftCache.set(user.id, draft);

		return draft;
	}

	@bindThis
	public async getDraft(user: MiUser): Promise<MiNoteDraft | null> {
		const cachedDraft = this.draftCache.get(user.id);
		if (cachedDraft) return cachedDraft;

		const draft = await this.noteDraftsRepository.findOne({ where: { userId: user.id } });
		if (draft) {
			this.draftCache.set(user.id, draft);
		}
		return draft;
	}

	@bindThis
	public async deleteDraft(user: MiUser): Promise<boolean> {
		const result = await this.noteDraftsRepository.delete({ userId: user.id });
		this.draftCache.delete(user.id);
		return result.affected ? result.affected > 0 : true;
	}
}
