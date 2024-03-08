import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1709923564488 implements MigrationInterface {
  name = 'InitDatabase1709923564488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spizzichouse"."match" ("id" SERIAL NOT NULL, "totalPoints" integer NOT NULL, "inProgress" boolean NOT NULL DEFAULT true, "locationId" integer, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spizzichouse"."round" ("roundId" integer NOT NULL, "userId" integer NOT NULL, "matchId" integer NOT NULL, "points" integer NOT NULL, CONSTRAINT "UQ_14b25079f479eb3ddb05bf31509" UNIQUE ("roundId", "userId", "matchId"), CONSTRAINT "PK_14b25079f479eb3ddb05bf31509" PRIMARY KEY ("roundId", "userId", "matchId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spizzichouse"."user" ("id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "locationId" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spizzichouse"."location" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spizzichouse"."users_matches" ("matchId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_a365645ec51d3cb179339ffac6d" PRIMARY KEY ("matchId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0137bfdeb395f857b235994fab" ON "spizzichouse"."users_matches" ("matchId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f47cad2773072dcb52f6edd601" ON "spizzichouse"."users_matches" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."match" ADD CONSTRAINT "FK_e07b88f570ffba262eda9127a36" FOREIGN KEY ("locationId") REFERENCES "spizzichouse"."location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."round" ADD CONSTRAINT "FK_ec27aa2ac080b5ed3ec7c8c3c8a" FOREIGN KEY ("userId") REFERENCES "spizzichouse"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."round" ADD CONSTRAINT "FK_7f3ebe2c9b6582d68973dd1de22" FOREIGN KEY ("matchId") REFERENCES "spizzichouse"."match"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."user" ADD CONSTRAINT "FK_93e37a8413a5745a9b52bc3c0c1" FOREIGN KEY ("locationId") REFERENCES "spizzichouse"."location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."users_matches" ADD CONSTRAINT "FK_0137bfdeb395f857b235994fabf" FOREIGN KEY ("matchId") REFERENCES "spizzichouse"."match"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."users_matches" ADD CONSTRAINT "FK_f47cad2773072dcb52f6edd6016" FOREIGN KEY ("userId") REFERENCES "spizzichouse"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."users_matches" DROP CONSTRAINT "FK_f47cad2773072dcb52f6edd6016"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."users_matches" DROP CONSTRAINT "FK_0137bfdeb395f857b235994fabf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."user" DROP CONSTRAINT "FK_93e37a8413a5745a9b52bc3c0c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."round" DROP CONSTRAINT "FK_7f3ebe2c9b6582d68973dd1de22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."round" DROP CONSTRAINT "FK_ec27aa2ac080b5ed3ec7c8c3c8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spizzichouse"."match" DROP CONSTRAINT "FK_e07b88f570ffba262eda9127a36"`,
    );
    await queryRunner.query(
      `DROP INDEX "spizzichouse"."IDX_f47cad2773072dcb52f6edd601"`,
    );
    await queryRunner.query(
      `DROP INDEX "spizzichouse"."IDX_0137bfdeb395f857b235994fab"`,
    );
    await queryRunner.query(`DROP TABLE "spizzichouse"."users_matches"`);
    await queryRunner.query(`DROP TABLE "spizzichouse"."location"`);
    await queryRunner.query(`DROP TABLE "spizzichouse"."user"`);
    await queryRunner.query(`DROP TABLE "spizzichouse"."round"`);
    await queryRunner.query(`DROP TABLE "spizzichouse"."match"`);
  }
}
