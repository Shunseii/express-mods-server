import {MigrationInterface, QueryRunner} from "typeorm";

export class ModImagesMigration1632983819604 implements MigrationInterface {
    name = 'ModImagesMigration1632983819604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "mods"."images" IS NULL`);
        await queryRunner.query(`ALTER TABLE "mods" ALTER COLUMN "images" SET DEFAULT array[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mods" ALTER COLUMN "images" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`COMMENT ON COLUMN "mods"."images" IS NULL`);
    }

}
