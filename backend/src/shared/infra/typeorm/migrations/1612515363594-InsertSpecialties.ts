import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertSpecialties1612515363594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO specialties("name")values
      ('ALERGOLOGIA'),('ANGIOLOGIA'),('BUCO MAXILO'),('CARDIOLOGIA CLÍNICA'),('CARDIOLOGIA INFANTIL'),
      ('CIRURGIA CABEÇA E PESCOÇO'),('CIRURGIA CARDÍACA'),('CIRURGIA DE TÓRAX');`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM specialties WHERE "name"='ALERGOLOGIA' or "name"='ANGIOLOGIA' or "name"='BUCO MAXILO'or "name"='CARDIOLOGIA CLÍNICA'
    or "name"='CARDIOLOGIA INFANTIL' or "name"='CIRURGIA CABEÇA E PESCOÇO' or "name"='CIRURGIA CARDÍACA' or "name"='CIRURGIA DE TÓRAX';`)
  }
}
