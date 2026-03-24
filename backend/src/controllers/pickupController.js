const db = require('../config/db');

const createPickup = async (req, res) => {
  try {
    const { jenis_sampah, foto_url } = req.body;

    if (!jenis_sampah) {
      return res.status(400).json({
        message: 'jenis_sampah wajib diisi',
      });
    }

    const [result] = await db.query(
      `INSERT INTO pickups (warga_id, status, jenis_sampah, foto_url)
       VALUES (?, 'pending', ?, ?)`,
      [req.user.id, jenis_sampah, foto_url || null]
    );

    return res.status(201).json({
      message: 'Laporan penjemputan berhasil dibuat',
      pickup: {
        id: result.insertId,
        warga_id: req.user.id,
        status: 'pending',
        jenis_sampah,
        foto_url: foto_url || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat membuat laporan penjemputan',
      error: error.message,
    });
  }
};

const claimPickup = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE pickups
       SET driver_id = ?, status = 'on-process'
       WHERE id = ? AND status = 'pending'`,
      [req.user.id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Tugas tidak ditemukan atau sudah tidak pending',
      });
    }

    return res.status(200).json({
      message: 'Tugas berhasil diambil driver',
      pickup_id: Number(id),
      driver_id: req.user.id,
      status: 'on-process',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil tugas',
      error: error.message,
    });
  }
};

const completePickup = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    const { id } = req.params;
    const { berat_kg } = req.body;

    const parsedWeight = Number(berat_kg);
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      return res.status(400).json({
        message: 'berat_kg harus angka dan lebih dari 0',
      });
    }

    const pointsToAdd = Math.round(parsedWeight * 100);

    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT id, warga_id, driver_id, status
       FROM pickups
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: 'Data penjemputan tidak ditemukan',
      });
    }

    const pickup = rows[0];

    if (pickup.status !== 'on-process') {
      await connection.rollback();
      return res.status(400).json({
        message: 'Pickup hanya bisa diselesaikan dari status on-process',
      });
    }

    if (pickup.driver_id !== req.user.id) {
      await connection.rollback();
      return res.status(403).json({
        message: 'Driver tidak berhak menyelesaikan pickup ini',
      });
    }

    await connection.query(
      `UPDATE pickups
       SET berat_kg = ?, status = 'done'
       WHERE id = ?`,
      [parsedWeight, id]
    );

    await connection.query(
      `UPDATE users
       SET saldo_poin = saldo_poin + ?
       WHERE id = ?`,
      [pointsToAdd, pickup.warga_id]
    );

    await connection.query(
      `INSERT INTO point_history (user_id, jumlah_poin, tipe, keterangan)
       VALUES (?, ?, 'tambah', ?)`,
      [
        pickup.warga_id,
        pointsToAdd,
        `Tambah poin dari pickup #${id} dengan berat ${parsedWeight} kg`,
      ]
    );

    await connection.commit();

    return res.status(200).json({
      message: 'Pickup selesai dan poin berhasil ditambahkan',
      pickup_id: Number(id),
      status: 'done',
      berat_kg: parsedWeight,
      poin_ditambahkan: pointsToAdd,
      warga_id: pickup.warga_id,
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        // Ignore rollback error to keep the original error response.
      }
    }

    return res.status(500).json({
      message: 'Terjadi kesalahan saat menyelesaikan pickup',
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createPickup,
  claimPickup,
  completePickup,
};
