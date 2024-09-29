import { Inject, Injectable } from '@nestjs/common';
import { DI } from '@/di-symbols.js';
import type { NoteDraftsRepository } from '@/models/_.js';
import type { MiUser } from '@/models/User.js';
import { MiNoteDraft } from '@/models/NoteDraft.js';
import { bindThis } from '@/decorators.js';

import { IdService } from './IdService.js';

@Injectable()
export class NoteDraftService {
	constructor(
        @Inject(DI.noteDraftsRepository)
        private noteDraftsRepository: NoteDraftsRepository,

				private idService: IdService,
	) {}

    @bindThis
	public async saveDraft(user: MiUser, data: Partial<MiNoteDraft>): Promise<MiNoteDraft> {
		let draft = await this.noteDraftsRepository.findOne({ where: { userId: user.id } });

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

		return draft;
	}

    @bindThis
    public async getDraft(user: MiUser): Promise<MiNoteDraft | null> {
    	return await this.noteDraftsRepository.findOne({ where: { userId: user.id } });
    }

    @bindThis
    public async deleteDraft(user: MiUser): Promise<void> {
    	await this.noteDraftsRepository.delete({ userId: user.id });
    }
}
