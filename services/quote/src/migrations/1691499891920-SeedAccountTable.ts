import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAccountTable1691499891920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO account (cnpj, token, platform_code, zip_code)
    VALUES ('25438296000158', '1d52a9b6b78cf07b08586152459a5c90', '5AKVkHqCn', '29161-376');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM account WHERE cnpj = '25438296000158';
    `);
  }
}
