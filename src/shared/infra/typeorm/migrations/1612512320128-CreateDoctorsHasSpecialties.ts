import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDoctorsHasSpecialties1612512320128 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'doctor_has_specialties',
      columns: [
        {
          name: 'doctor_id',
          type: 'uuid',
        },
        {
          name: 'specialty_id',
          type: 'uuid',
        }
      ]
    }))

    await queryRunner.createForeignKey(
      'doctor_has_specialties',
      new TableForeignKey({
        name: 'DoctorHasSpecialtiesDoctor',
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'doctors'
      })
    )

    await queryRunner.createForeignKey(
      'doctor_has_specialties',
      new TableForeignKey({
        name: 'DoctorHasSpecialtiesSpecialties',
        columnNames: ['specialty_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'specialties'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
