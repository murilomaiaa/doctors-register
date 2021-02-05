import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAddresses1612510853741 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },

          {
            name: 'zipcode',
            type: 'char(8)',
          },
          {
            name: 'state',
            type: 'char(2)', // MG, PR, SP...
          },
          {
            name: 'city',
            type: 'varchar(55)',
          },
          {
            name: 'neighborhood',
            type: 'varchar(55)',
          },
          {
            name: 'street',
            type: 'varchar(55)',
          },
          {
            name: 'number',
            type: 'varchar(11)',
          },
          {
            name: 'complementary',
            type: 'varchar',
            isNullable: true,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses')
  }

}
