import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRouteNameToDeparture1752134667246 implements MigrationInterface {
    name = 'AddRouteNameToDeparture1752134667246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" ADD "routeName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departure" DROP COLUMN "routeName"`);
    }

}
