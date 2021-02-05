import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDoctors1612511570614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'doctors',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'crm',
          type: 'char(7)',
          isUnique: true
        },
        {
          name: 'name',
          type: 'varchar(120)',
        },
        {
          name: 'landline',
          type: 'varchar(11)',
        },
        {
          name: 'phone',
          type: 'varchar(11)',
        },
        {
          name: 'address_id',
          type: 'uuid',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'deleted_at',
          type: 'timestamp',
          isNullable: true
        },
      ],
    }))

    await queryRunner.createForeignKey(
      'doctors',
      new TableForeignKey({
        name: 'DoctorAddress',
        columnNames: ['address_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addresses',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('specialties')
  }
}
