import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDelayInMinutesToDeparture1751936386720 implements MigrationInterface {
    name = 'AddDelayInMinutesToDeparture1751936386720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" ADD "delayInMinutes" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" DROP COLUMN "delayInMinutes"`);
    }

}
