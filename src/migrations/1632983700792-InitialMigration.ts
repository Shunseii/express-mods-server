import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1632983700792 implements MigrationInterface {
    name = 'InitialMigration1632983700792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "gameSlug" character varying NOT NULL, "imageName" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_28639e6be5f363b0257ec04e14f" UNIQUE ("name"), CONSTRAINT "UQ_c17bf83ba09326d53b258678c2d" UNIQUE ("gameSlug"), CONSTRAINT "UQ_db5f0958f58c50a1d8ea478c105" UNIQUE ("imageName"), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("userId" integer NOT NULL, "modId" integer NOT NULL, CONSTRAINT "PK_428b00681ab3ed7083d0995c66e" PRIMARY KEY ("userId", "modId"))`);
        await queryRunner.query(`CREATE TABLE "mods" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "images" text array NOT NULL DEFAULT array[]::text[], "authorId" integer NOT NULL, "gameId" integer NOT NULL, CONSTRAINT "PK_5e0ced6abe92940577832c70cd4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" character varying NOT NULL, "modId" integer NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_03aba22fd3c3dee0f350e59f4b4" FOREIGN KEY ("modId") REFERENCES "mods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mods" ADD CONSTRAINT "FK_8954eabbe667f26097c70d05f5c" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mods" ADD CONSTRAINT "FK_6f589feb69b3b4142417ac5d0b9" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_05035d1b9540bf687c23f71bef7" FOREIGN KEY ("modId") REFERENCES "mods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_05035d1b9540bf687c23f71bef7"`);
        await queryRunner.query(`ALTER TABLE "mods" DROP CONSTRAINT "FK_6f589feb69b3b4142417ac5d0b9"`);
        await queryRunner.query(`ALTER TABLE "mods" DROP CONSTRAINT "FK_8954eabbe667f26097c70d05f5c"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_03aba22fd3c3dee0f350e59f4b4"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "mods"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "games"`);
    }

}
