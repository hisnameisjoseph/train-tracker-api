import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckCurrentSchema1751952256194 implements MigrationInterface {
    name = 'CheckCurrentSchema1751952256194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" DROP COLUMN "createdAt"`);
    }

}
