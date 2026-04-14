CREATE DATABASE IF NOT EXISTS pilahin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pilahin_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS point_history;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS schedule_requests;
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

CREATE TABLE schedule_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  warga_id INT UNSIGNED NOT NULL,
  assigned_driver_id INT UNSIGNED NULL,
  requested_day ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
  requested_time CHAR(5) NOT NULL,
  approved_day ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NULL,
  approved_time CHAR(5) NULL,
  suggested_day ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NULL,
  suggested_time CHAR(5) NULL,
  approval_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  pickup_status ENUM('pending', 'otw', 'done') NOT NULL DEFAULT 'pending',
  catatan TEXT,
  admin_note TEXT,
  weight_kg DECIMAL(10,2) DEFAULT 0.00,
  earned_points INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_schedule_requests_warga
    FOREIGN KEY (warga_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_schedule_requests_driver
    FOREIGN KEY (assigned_driver_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
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
CREATE INDEX idx_schedule_requests_warga_id ON schedule_requests (warga_id);
CREATE INDEX idx_schedule_requests_driver_id ON schedule_requests (assigned_driver_id);
CREATE INDEX idx_schedule_requests_approval_status ON schedule_requests (approval_status);
CREATE INDEX idx_schedule_requests_pickup_status ON schedule_requests (pickup_status);
CREATE INDEX idx_point_history_user_id ON point_history (user_id);

INSERT INTO users (nama, email, password, no_wa, role, alamat, lat_long, saldo_poin)
VALUES
  (
    'Warga 1',
    'warga@example.com',
    -- password: warga123
    '$2b$10$LfkvgR2Ej4WnSBAZfnfD4uciq8GbU25Ps277PF0vDhSJypkhSZoXa',
    '081234567890',
    'warga',
    'Jl. Melati No. 10',
    '-6.2088,106.8456',
    0
  ),
  (
    'Warga 2',
    'warga2@example.com',
    -- password: warga456
    '$2b$10$1Ar4Rq9UZG26Ds8ie8O9dudgORvrfvzxCKTDFkrAPuRQ9gHYf0i5C',
    '081234567893',
    'warga',
    'Jl. Cempaka No. 21',
    '-6.2035,106.8431',
    0
  ),
  (
    'Warga 3',
    'warga3@example.com',
    -- password: warga789
    '$2b$10$sFHovY/Cs5VaCaCanXrbKu9uxGSUrxjnUJ2BLRE1EAdSYaTlqHenq',
    '081234567894',
    'warga',
    'Jl. Kenanga No. 7',
    '-6.2102,106.8514',
    0
  ),
  (
    'Driver 1',
    'driver@example.com',
    -- password: driver123
    '$2b$10$h/iBUHAFmSYXZQ7BV1Vg6Ougsrz563f6Qhty9U2geiz63OJf/Sw8q',
    '081234567891',
    'driver',
    'Pool Armada Pilahin',
    '-6.2191,106.8359',
    0
  ),
  (
    'Admin Utama',
    'admin@example.com',
    -- password: admin123
    '$2b$10$tUwKY204rCt99gFHvIjb3enWOk4usKqMz3AvEJ8ixxCD7tGYytFnu',
    '081234567892',
    'admin',
    'Kantor Pusat Pilahin',
    '-6.1754,106.8272',
    0
  );
