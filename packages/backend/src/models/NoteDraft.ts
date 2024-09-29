import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { noteVisibilities, reactionAcceptances } from '@/types.js';
import { id } from './util/id.js';
import { MiUser } from './User.js';

@Entity('note_draft')
export class MiNoteDraft {
    @PrimaryColumn(id())
	public id: string;

    @Column(id())
    public userId: MiUser['id'];

    @ManyToOne(type => MiUser, {
    	onDelete: 'CASCADE',
    })
    @JoinColumn()
    public user: MiUser | null;

    @Column('text', {
    	nullable: true,
    })
    public text: string | null;

    @Column('boolean', {
    	default: false,
    })
    public useCw: boolean;

    @Column('varchar', {
    	length: 256,
    	nullable: true,
    })
    public cw: string | null;

    @Column('enum', { enum: noteVisibilities })
    public visibility: typeof noteVisibilities[number];

    @Column('boolean', {
    	default: false,
    })
    public localOnly: boolean;

    @Column('text', {
    	nullable: true,
    })
    public files: string | null;

    @Column('text', {
    	nullable: true,
    })
    public poll: string | null;

    @Column('varchar', {
    	length: 128,
    	array: true,
    	nullable: true,
    })
    public visibleUserIds: string[] | null;

    @Column({
    	...id(),
    	nullable: true,
    })
    public quoteId: string | null;

    @Column('enum', {
    	enum: ['likeOnly', 'likeOnlyForRemote', 'nonSensitiveOnly', 'nonSensitiveOnlyForLocalLikeOnlyForRemote', null],
    	nullable: true,
    })
    public reactionAcceptance: typeof reactionAcceptances[number] | null;

    @Column('timestamp with time zone', {
    	nullable: false,
    	default: () => 'now()',
    })
    public updatedAt: Date;
}
