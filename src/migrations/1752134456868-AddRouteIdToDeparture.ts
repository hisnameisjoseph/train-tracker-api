import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRouteIdToDeparture1752134456868 implements MigrationInterface {
    name = 'AddRouteIdToDeparture1752134456868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" ADD "routeId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" DROP COLUMN "routeId"`);
    }

}
