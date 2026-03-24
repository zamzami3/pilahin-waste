CREATE DATABASE IF NOT EXISTS pilahin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pilahin_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS point_history;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS pickups;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  no_wa VARCHAR(20),
  role ENUM('admin', 'driver', 'warga') NOT NULL,
  alamat TEXT,
  lat_long VARCHAR(100),
  saldo_poin INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE pickups (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  warga_id INT UNSIGNED NOT NULL,
  driver_id INT UNSIGNED NULL,
  status ENUM('pending', 'on-process', 'done', 'cancelled') NOT NULL DEFAULT 'pending',
  berat_kg DECIMAL(10,2) DEFAULT 0.00,
  jenis_sampah VARCHAR(100),
  foto_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pickups_warga
    FOREIGN KEY (warga_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_pickups_driver
    FOREIGN KEY (driver_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  tipe_paket ENUM('Silver', 'Gold', 'Emerald') NOT NULL,
  tgl_mulai DATE NOT NULL,
  tgl_berakhir DATE NOT NULL,
  status ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
  CONSTRAINT fk_subscriptions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE point_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  jumlah_poin INT NOT NULL,
  tipe ENUM('tambah', 'tukar') NOT NULL,
  keterangan VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_point_history_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_pickups_warga_id ON pickups (warga_id);
CREATE INDEX idx_pickups_driver_id ON pickups (driver_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_point_history_user_id ON point_history (user_id);

INSERT INTO users (nama, email, password, no_wa, role, alamat, lat_long, saldo_poin)
VALUES
  (
    'Warga Sample',
    'warga@example.com',
    '$2b$10$33PcYgVSfOFflAtmn92gfuTje8iecEPlGokQ5ZHQ7pySH3sFR9am.',
    '081234567890',
    'warga',
    'Jl. Melati No. 10',
    '-6.2088,106.8456',
    120
  ),
  (
    'Driver Sample',
    'driver@example.com',
    '$2b$10$lNeOJPgWtCUPBxQ.E7ieGOf47kOIqxTZwdyTxBQ9PJmC3xIIthmFm',
    '081234567891',
    'driver',
    'Pool Armada Pilahin',
    '-6.2191,106.8359',
    0
  ),
  (
    'Admin Sample',
    'admin@example.com',
    '$2b$10$aMdid.CezdKIsLh/fU9z8uX07nIhep5s21FV32CmLP//n/ZMg1uJe',
    '081234567892',
    'admin',
    'Kantor Pusat Pilahin',
    '-6.1754,106.8272',
    0
  );
