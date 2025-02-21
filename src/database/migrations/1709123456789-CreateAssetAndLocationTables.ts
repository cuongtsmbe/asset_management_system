import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssetAndLocationTables1709123456789
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE locations (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active'
      );

      CREATE TABLE assets (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        serial VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        description TEXT,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        location_id INT,
        last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations(id)
      );

      CREATE TABLE sync_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sync_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL,
        total_records INT NOT NULL,
        success_count INT NOT NULL,
        error_count INT NOT NULL,
        error_details TEXT
      );
    `);

    // Insert initial location data
    await queryRunner.query(`
      INSERT INTO locations (id, name, organization, status) VALUES
      (1, 'Da Nang', 'PNS', 'active'),
      (2, 'Ha Noi', 'PNS', 'inactive'),
      (3, 'Ho Chi Minh', 'PNS', 'active'),
      (4, 'Nha Trang', 'PLJ', 'active'),
      (5, 'Can Tho', 'PLJ', 'active');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE assets`);
    await queryRunner.query(`DROP TABLE locations`);
    await queryRunner.query(`DROP TABLE sync_history`);
  }
}
