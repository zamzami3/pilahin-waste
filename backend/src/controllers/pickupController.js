const db = require('../config/db');
const { logAuditEvent } = require('../middleware/auditLogger');

function parsePagination(query = {}) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

const listPickups = async (req, res) => {
  try {
    const { status } = req.query;
    const { limit, offset, page } = parsePagination(req.query);
    const params = [];
    const where = [];

    if (status) {
      where.push('p.status = ?');
      params.push(status);
    }

    if (req.user.role === 'warga') {
      where.push('p.warga_id = ?');
      params.push(req.user.id);
    } else if (req.user.role === 'driver') {
      if (status === 'pending') {
        where.push('p.status = ?');
        params.push('pending');
      } else {
        where.push('(p.driver_id = ? OR p.status = ?)');
        params.push(req.user.id, 'pending');
      }
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await db.query(
      `SELECT p.id, p.warga_id, p.driver_id, p.status, p.berat_kg, p.jenis_sampah, p.foto_url, p.created_at,
              warga.nama AS warga_nama,
              driver.nama AS driver_nama
       FROM pickups p
       JOIN users warga ON warga.id = p.warga_id
       LEFT JOIN users driver ON driver.id = p.driver_id
       ${whereSql}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return res.status(200).json({
      message: 'Data pickup berhasil diambil',
      data: rows,
      pagination: { page, limit },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data pickup',
      error: error.message,
    });
  }
};

const getPickupHistory = async (req, res) => {
  try {
    const targetUserId = Number(req.query.user_id);
    const params = [];
    const where = ['p.status = ?'];
    params.push('done');

    if (req.user.role === 'warga') {
      where.push('p.warga_id = ?');
      params.push(req.user.id);
    } else if (req.user.role === 'driver') {
      where.push('p.driver_id = ?');
      params.push(req.user.id);
    } else if (Number.isInteger(targetUserId) && targetUserId > 0) {
      where.push('(p.warga_id = ? OR p.driver_id = ?)');
      params.push(targetUserId, targetUserId);
    }

    const [rows] = await db.query(
      `SELECT p.id, p.warga_id, p.driver_id, p.status, p.berat_kg, p.jenis_sampah, p.created_at,
              warga.nama AS warga_nama,
              driver.nama AS driver_nama
       FROM pickups p
       JOIN users warga ON warga.id = p.warga_id
       LEFT JOIN users driver ON driver.id = p.driver_id
       WHERE ${where.join(' AND ')}
       ORDER BY p.created_at DESC`,
      params
    );

    return res.status(200).json({
      message: 'Riwayat pickup berhasil diambil',
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil riwayat pickup',
      error: error.message,
    });
  }
};

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

    logAuditEvent({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'pickup.claim',
      entityType: 'pickup',
      entityId: Number(id),
    });

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
    const hasWeight = Number.isFinite(parsedWeight) && parsedWeight > 0;
    const pointsToAdd = hasWeight ? Math.round(parsedWeight * 3) : 2;

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
      [hasWeight ? parsedWeight : 0, id]
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
        hasWeight
          ? `Tambah poin dari pickup #${id} dengan berat ${parsedWeight} kg`
          : `Tambah poin default dari pickup #${id} tanpa input berat`,
      ]
    );

    logAuditEvent({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'pickup.complete',
      entityType: 'pickup',
      entityId: Number(id),
      metadata: {
        warga_id: pickup.warga_id,
        points_added: pointsToAdd,
        berat_kg: hasWeight ? parsedWeight : null,
      },
    });

    await connection.commit();

    return res.status(200).json({
      message: 'Pickup selesai dan poin berhasil ditambahkan',
      pickup_id: Number(id),
      status: 'done',
      berat_kg: hasWeight ? parsedWeight : null,
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

const cancelPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT id, warga_id, driver_id, status
       FROM pickups
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Data pickup tidak ditemukan',
      });
    }

    const pickup = rows[0];
    const isAdmin = req.user.role === 'admin';
    const isOwnerWarga = req.user.role === 'warga' && pickup.warga_id === req.user.id;

    if (!isAdmin && !isOwnerWarga) {
      return res.status(403).json({
        message: 'Akses ditolak untuk membatalkan pickup ini',
      });
    }

    if (!isAdmin && pickup.status !== 'pending') {
      return res.status(400).json({
        message: 'Warga hanya bisa membatalkan pickup dengan status pending',
      });
    }

    await db.query(
      `UPDATE pickups
       SET status = 'cancelled'
       WHERE id = ?`,
      [id]
    );

    logAuditEvent({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'pickup.cancel',
      entityType: 'pickup',
      entityId: Number(id),
      metadata: { previous_status: pickup.status },
    });

    return res.status(200).json({
      message: 'Pickup berhasil dibatalkan',
      pickup_id: Number(id),
      status: 'cancelled',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat membatalkan pickup',
      error: error.message,
    });
  }
};

module.exports = {
  listPickups,
  getPickupHistory,
  createPickup,
  claimPickup,
  completePickup,
  cancelPickup,
};
