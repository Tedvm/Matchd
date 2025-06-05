/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class Password1749151244686 {
    name = 'Password1749151244686'

    async up(queryRunner) {
        // 1) On crée d’abord la table temporaire "temporary_user" en ajoutant
        //    DEFAULT '' à la colonne "password" pour satisfaire la contrainte NOT NULL.
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "password" varchar NOT NULL DEFAULT '',
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);

        // 2) On copie les anciennes données dans "temporary_user".
        //    Notez que l'on fournit '' pour la colonne "password".
        await queryRunner.query(`
            INSERT INTO "temporary_user"("id", "email", "firstname", "lastname", "password")
            SELECT 
                "id",
                "email",
                "firstname",
                "lastname",
                '' 
            FROM "user"
        `);

        // 3) On supprime l’ancienne table "user"
        await queryRunner.query(`
            DROP TABLE "user"
        `);

        // 4) On renomme "temporary_user" en "user" (nouveau schéma avec "password")
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
    }

    async down(queryRunner) {
        // Pour annuler la migration, on fait l’inverse :
        // 1) Renommer la table "user" actuelle en "temporary_user"
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);

        // 2) Recréer l’ancienne table "user" sans la colonne "password"
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);

        // 3) Copier les données depuis "temporary_user" vers la nouvelle table "user"
        await queryRunner.query(`
            INSERT INTO "user"("id", "email", "firstname", "lastname")
            SELECT 
                "id",
                "email",
                "firstname",
                "lastname"
            FROM "temporary_user"
        `);

        // 4) Supprimer la table temporaire
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
    }
}
