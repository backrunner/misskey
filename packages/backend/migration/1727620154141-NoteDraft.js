export class NoteDraft1727620154141 {
	name = 'NoteDraft1727620154141';

	async up(queryRunner) {
		await queryRunner.query('CREATE TYPE "public"."note_draft_visibility_enum" AS ENUM(\'public\', \'home\', \'followers\', \'specified\')');
		await queryRunner.query('CREATE TYPE "public"."note_draft_reactionacceptance_enum" AS ENUM(\'likeOnly\', \'likeOnlyForRemote\', \'nonSensitiveOnly\', \'nonSensitiveOnlyForLocalLikeOnlyForRemote\', \'null\')');
		await queryRunner.query('CREATE TABLE "note_draft" ("id" character varying(32) NOT NULL, "userId" character varying(32) NOT NULL, "text" text, "useCw" boolean NOT NULL DEFAULT false, "cw" character varying(256), "visibility" "public"."note_draft_visibility_enum" NOT NULL, "localOnly" boolean NOT NULL DEFAULT false, "files" text, "poll" text, "visibleUserIds" character varying(128) array, "quoteId" character varying(32), "reactionAcceptance" "public"."note_draft_reactionacceptance_enum", "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8335327f9da72a0e6c5082e724c" PRIMARY KEY ("id"))');
		await queryRunner.query('ALTER TABLE "note_draft" ADD CONSTRAINT "FK_e4983f28b4b18b03491536052f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
	}

	async down(queryRunner) {
		await queryRunner.query('ALTER TABLE "note_draft" DROP CONSTRAINT "FK_e4983f28b4b18b03491536052f5"');
		await queryRunner.query('DROP TABLE "note_draft"');
		await queryRunner.query('DROP TYPE "public"."note_draft_reactionacceptance_enum"');
		await queryRunner.query('DROP TYPE "public"."note_draft_visibility_enum"');
	}
};
