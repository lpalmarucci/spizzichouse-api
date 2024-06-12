import { MigrationInterface, QueryRunner } from 'typeorm';

export class MatchHistory1718183995973 implements MigrationInterface {
  name = 'MatchHistory1718183995973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spizzichouse"."match_history" ("matchId" integer NOT NULL, "userId" integer NOT NULL, "win" boolean NOT NULL, "totalScore" integer NOT NULL, CONSTRAINT "UQ_2bce9c9448d664626a70944ae63" UNIQUE ("matchId", "userId"), CONSTRAINT "PK_2bce9c9448d664626a70944ae63" PRIMARY KEY ("matchId", "userId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."round" ADD CONSTRAINT "UQ_14b25079f479eb3ddb05bf31509" UNIQUE ("roundId", "userId", "matchId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."match_history" ADD CONSTRAINT "FK_fab180b043d043cd669ea0fcf02" FOREIGN KEY ("userId") REFERENCES "spizzichouse"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."match_history" ADD CONSTRAINT "FK_e227111e8c38e3d71c45b3987eb" FOREIGN KEY ("matchId") REFERENCES "spizzichouse"."match"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."match_history" DROP CONSTRAINT "FK_e227111e8c38e3d71c45b3987eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."match_history" DROP CONSTRAINT "FK_fab180b043d043cd669ea0fcf02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."round" DROP CONSTRAINT "UQ_14b25079f479eb3ddb05bf31509"`,
    );
    await queryRunner.query(`DROP TABLE "spizzichouse"."match_history"`);
  }
}
