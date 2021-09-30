import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeToUUIDMigration1632995420382 implements MigrationInterface {
    name = 'ChangeToUUIDMigration1632995420382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mods" DROP CONSTRAINT "FK_6f589feb69b3b4142417ac5d0b9"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "PK_c9b16b62917b5595af982d66337"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "mods" DROP CONSTRAINT "FK_8954eabbe667f26097c70d05f5c"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_03aba22fd3c3dee0f350e59f4b4"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_428b00681ab3ed7083d0995c66e"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_03aba22fd3c3dee0f350e59f4b4" PRIMARY KEY ("modId")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_03aba22fd3c3dee0f350e59f4b4"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_428b00681ab3ed7083d0995c66e" PRIMARY KEY ("modId", "userId")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_428b00681ab3ed7083d0995c66e"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_cfd8e81fac09d7339a32e57d904" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "modId"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "modId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_428b00681ab3ed7083d0995c66e" PRIMARY KEY ("userId", "modId")`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_05035d1b9540bf687c23f71bef7"`);
        await queryRunner.query(`ALTER TABLE "mods" DROP CONSTRAINT "PK_5e0ced6abe92940577832c70cd4"`);
        await queryRunner.query(`ALTER TABLE "mods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "mods" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "mods" ADD CONSTRAINT "PK_5e0ced6abe92940577832c70cd4" PRIMARY KEY ("id")`);
        await queryRunner.query(`COMMENT ON COLUMN "mods"."images" IS NULL`);
        await queryRunner.query(`ALTER TABLE "mods" ALTER COLUMN "images" SET DEFAULT array[]::text[]`);
        await queryRunner.query(`ALTER TABLE "mods" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "mods" ADD "authorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mods" DROP COLUMN "gameId"`);
        await queryRunner.query(`ALTER TABLE "mods" ADD "gameId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "modId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "modId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "authorId" uuid NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "authorId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "modId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "modId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "mods" DROP COLUMN "gameId"`);
        await queryRunner.query(`ALTER TABLE "mods" ADD "gameId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mods" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "mods" ADD "authorId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mods" ALTER COLUMN "images" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`COMMENT ON COLUMN "mods"."images" IS NULL`);
        await queryRunner.query(`ALTER TABLE "mods" DROP CONSTRAINT "PK_5e0ced6abe92940577832c70cd4"`);
        await queryRunner.query(`ALTER TABLE "mods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "mods" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mods" ADD CONSTRAINT "PK_5e0ced6abe92940577832c70cd4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_05035d1b9540bf687c23f71bef7" FOREIGN KEY ("modId") REFERENCES "mods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_428b00681ab3ed7083d0995c66e"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_cfd8e81fac09d7339a32e57d904" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "modId"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "modId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_428b00681ab3ed7083d0995c66e" PRIMARY KEY ("modId", "userId")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_428b00681ab3ed7083d0995c66e"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_03aba22fd3c3dee0f350e59f4b4" PRIMARY KEY ("modId")`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "PK_03aba22fd3c3dee0f350e59f4b4"`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "PK_428b00681ab3ed7083d0995c66e" PRIMARY KEY ("userId", "modId")`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_03aba22fd3c3dee0f350e59f4b4" FOREIGN KEY ("modId") REFERENCES "mods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mods" ADD CONSTRAINT "FK_8954eabbe667f26097c70d05f5c" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "PK_c9b16b62917b5595af982d66337"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "mods" ADD CONSTRAINT "FK_6f589feb69b3b4142417ac5d0b9" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
