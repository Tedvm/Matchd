/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class Favs1749168477964 {
    name = 'Favs1749168477964'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "password" varchar NOT NULL DEFAULT (''),
                "favorites" text NOT NULL DEFAULT (''),
                "vus" text NOT NULL DEFAULT ('[]'),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "password"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "password"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "password" varchar NOT NULL,
                "favorites" text NOT NULL DEFAULT (''),
                "vus" text NOT NULL DEFAULT ('[]'),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "password",
                    "favorites",
                    "vus"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "password",
                "favorites",
                "vus"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "password" varchar NOT NULL DEFAULT (''),
                "favorites" text NOT NULL DEFAULT (''),
                "vus" text NOT NULL DEFAULT ('[]'),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "password",
                    "favorites",
                    "vus"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "password",
                "favorites",
                "vus"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "password" varchar NOT NULL DEFAULT (''),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "password"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "password"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
    }
}
