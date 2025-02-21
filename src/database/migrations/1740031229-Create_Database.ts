import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1740031229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE organizations (
        id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE locations (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE location_organizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location_id INT NOT NULL,
        organization_id VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations(id),
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        UNIQUE KEY unique_location_org (location_id, organization_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE asset_types (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE assets (
        id VARCHAR(255) PRIMARY KEY,
        type_id VARCHAR(20) NOT NULL,
        serial VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) DEFAULT 'active',
        description TEXT,
        location_organization_id INT,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (type_id) REFERENCES asset_types(id) ON DELETE CASCADE,
        FOREIGN KEY (location_organization_id) REFERENCES location_organizations(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE sync_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sync_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL,
        total_records INT NOT NULL DEFAULT 0,
        success_count INT NOT NULL DEFAULT 0,
        error_count INT NOT NULL DEFAULT 0,
        error_details TEXT
      );
    `);

    await queryRunner.query(`
      INSERT INTO organizations (id, name) VALUES
      ('PNS', 'PNS Organization'),
      ('PLJ', 'PLJ Organization');
    `);

    await queryRunner.query(`
      INSERT INTO locations (id, name) VALUES
      (1, 'Da Nang'),
      (2, 'Ha Noi'),
      (3, 'Ho Chi Minh'),
      (4, 'Nha Trang'),
      (5, 'Can Tho');
    `);

    await queryRunner.query(`
      INSERT INTO location_organizations (location_id, organization_id) VALUES
      (1, 'PNS'),
      (2, 'PNS'),
      (3, 'PNS'),
      (4, 'PLJ'),
      (5, 'PLJ'),
      (1, 'PLJ');
    `);

    await queryRunner.query(`
      INSERT INTO asset_types (id, name) VALUES
      ('CIA1-10', 'CIA1-10 Asset Type'),
      ('CIA1-11', 'CIA1-11 Asset Type'),
      ('CIA1-12', 'CIA1-12 Asset Type'),
      ('CIA1-13', 'CIA1-13 Asset Type'),
      ('CIA1-14', 'CIA1-14 Asset Type'),
      ('CIA1-15', 'CIA1-15 Asset Type'),
      ('CIA1-16', 'CIA1-16 Asset Type'),
      ('CIA1-17', 'CIA1-17 Asset Type');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE sync_history`);
    await queryRunner.query(`DROP TABLE devices`);
    await queryRunner.query(`DROP TABLE device_types`);
    await queryRunner.query(`DROP TABLE location_organizations`);
    await queryRunner.query(`DROP TABLE locations`);
    await queryRunner.query(`DROP TABLE organizations`);
  }
}
