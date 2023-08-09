import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateQuoteTable1691581713334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quote',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'service',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'deadline',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'numeric',
            default: 0,
            precision: 10,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'quote',
      new TableIndex({
        name: 'IDX_QUOTE_NAME',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('quote', 'IDX_QUOTE_NAME');
    await queryRunner.dropTable('quote');
  }
}
