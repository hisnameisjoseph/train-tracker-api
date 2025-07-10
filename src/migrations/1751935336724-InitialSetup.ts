import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1751935336724 implements MigrationInterface {
    name = 'InitialSetup1751935336724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create station table
        await queryRunner.query(`
            CREATE TABLE "station" (
                "id" SERIAL NOT NULL, 
                "name" character varying NOT NULL, 
                "ptvStationId" integer NOT NULL, 
                CONSTRAINT "PK_station" PRIMARY KEY ("id")
            )
        `);

        // Create departure table
        await queryRunner.query(`
            CREATE TABLE "departure" (
                "id" SERIAL NOT NULL, 
                "stationId" integer NOT NULL, 
                "direction" character varying NOT NULL, 
                "platform" character varying NOT NULL, 
                "scheduledDepartureUtc" TIMESTAMP NOT NULL, 
                "estimatedDepartureUtc" TIMESTAMP, 
                CONSTRAINT "PK_departure" PRIMARY KEY ("id")
            )
        `);

        // Create foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "departure" 
            ADD CONSTRAINT "FK_departure_station" 
            FOREIGN KEY ("stationId") REFERENCES "station"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Create indexes for better performance
        await queryRunner.query(`CREATE INDEX "IDX_departure_stationId" ON "departure" ("stationId")`);
        await queryRunner.query(`CREATE INDEX "IDX_departure_scheduledTime" ON "departure" ("scheduledDepartureUtc")`);
        await queryRunner.query(`CREATE INDEX "IDX_station_ptvId" ON "station" ("ptvStationId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint first
        await queryRunner.query(`ALTER TABLE "departure" DROP CONSTRAINT "FK_departure_station"`);
        
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_departure_stationId"`);
        await queryRunner.query(`DROP INDEX "IDX_departure_scheduledTime"`);
        await queryRunner.query(`DROP INDEX "IDX_station_ptvId"`);
        
        // Drop tables
        await queryRunner.query(`DROP TABLE "departure"`);
        await queryRunner.query(`DROP TABLE "station"`);
    }

}
