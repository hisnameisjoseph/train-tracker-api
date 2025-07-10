import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStationPtvIdColumn1752129581525 implements MigrationInterface {
    name = 'UpdateStationPtvIdColumn1752129581525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "station" RENAME COLUMN "ptvStationId" TO "ptv_station_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "station" RENAME COLUMN "ptv_station_id" TO "ptvStationId"`);
    }

}
