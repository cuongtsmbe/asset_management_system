import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1708473456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE organizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        organization_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'actived',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations(id),
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        UNIQUE KEY unique_location_org (location_id, organization_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE asset_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE assets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serial VARCHAR(255) NOT NULL UNIQUE,
        type_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'actived',
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
      ('1', 'PNS'),
      ('2', 'PLJ');
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
      INSERT INTO location_organizations (location_id, organization_id, status) VALUES
      (1, 1, 'actived'),
      (2, 1, 'unactive'),
      (3, 1, 'actived'),
      (4, 2, 'actived'),
      (5, 2, 'actived')
    `);

    await queryRunner.query(`
      INSERT INTO asset_types (id, type) VALUES
      ('1', 'CIA1-10'),
      ('2', 'CIA1-11'),
      ('3', 'CIA1-12'),
      ('4', 'CIA1-13'),
      ('5', 'CIA1-14'),
      ('6', 'CIA1-15'),
      ('7', 'CIA1-16'),
      ('8', 'CIA1-17');
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
