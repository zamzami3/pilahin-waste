const db = require('../config/db');
const { logAuditEvent } = require('../middleware/auditLogger');

function normalizeDay(value) {
  const allowed = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  if (!value) return null;
  const normalized = String(value).trim();
  return allowed.includes(normalized) ? normalized : null;
}

function normalizeTime(value) {
  if (!value) return null;
  const text = String(value).trim();
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(text) ? text : null;
}

const createScheduleRequest = async (req, res) => {
  try {
    const requested_day = normalizeDay(req.body.requested_day);
    const requested_time = normalizeTime(req.body.requested_time);
    const catatan = req.body.catatan ? String(req.body.catatan).trim() : null;

    if (!requested_day || !requested_time) {
      return res.status(400).json({
        message: 'requested_day dan requested_time wajib valid',
      });
    }

    const [result] = await db.query(
      `INSERT INTO schedule_requests (
         warga_id, requested_day, requested_time, catatan,
         approval_status, pickup_status
       ) VALUES (?, ?, ?, ?, 'pending', 'pending')`,
      [req.user.id, requested_day, requested_time, catatan]
    );

    logAuditEvent({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'schedule.submit',
      entityType: 'schedule_request',
      entityId: result.insertId,
      metadata: { requested_day, requested_time },
    });

    return res.status(201).json({
      message: 'Pengajuan jadwal berhasil dibuat',
      data: {
        id: result.insertId,
        warga_id: req.user.id,
        requested_day,
        requested_time,
        catatan,
        approval_status: 'pending',
        pickup_status: 'pending',
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat membuat pengajuan jadwal',
      error: error.message,
    });
  }
};

const listMySchedules = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, warga_id, requested_day, requested_time, approved_day, approved_time,
              approval_status, pickup_status, catatan, admin_note, suggested_day, suggested_time,
              assigned_driver_id, weight_kg, earned_points, created_at, updated_at
       FROM schedule_requests
       WHERE warga_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      message: 'Daftar jadwal warga berhasil diambil',
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil jadwal warga',
      error: error.message,
    });
  }
};

const listAdminSchedules = async (req, res) => {
  try {
    const approvalStatus = req.query.approval_status ? String(req.query.approval_status) : null;
    const where = [];
    const params = [];

    if (approvalStatus) {
      where.push('sr.approval_status = ?');
      params.push(approvalStatus);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await db.query(
      `SELECT sr.id, sr.warga_id, sr.requested_day, sr.requested_time, sr.approved_day, sr.approved_time,
              sr.approval_status, sr.pickup_status, sr.catatan, sr.admin_note, sr.suggested_day, sr.suggested_time,
              sr.assigned_driver_id, sr.weight_kg, sr.earned_points, sr.created_at,
              u.nama AS warga_nama, u.alamat AS warga_alamat,
              d.nama AS driver_nama
       FROM schedule_requests sr
       JOIN users u ON u.id = sr.warga_id
       LEFT JOIN users d ON d.id = sr.assigned_driver_id
       ${whereSql}
       ORDER BY sr.created_at DESC`,
      params
    );

    const [driverRows] = await db.query(
      `SELECT id, nama, email
       FROM users
       WHERE role = 'driver'
       ORDER BY nama ASC`
    );

    return res.status(200).json({
      message: 'Daftar pengajuan admin berhasil diambil',
      data: rows,
      drivers: driverRows,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil pengajuan admin',
      error: error.message,
    });
  }
};

const updateAdminDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const approval_status = String(req.body.approval_status || '').trim();
    const admin_note = req.body.admin_note ? String(req.body.admin_note).trim() : null;
    const suggested_day = normalizeDay(req.body.suggested_day);
    const suggested_time = normalizeTime(req.body.suggested_time);
    const approved_day = normalizeDay(req.body.approved_day) || null;
    const approved_time = normalizeTime(req.body.approved_time) || null;
    const assigned_driver_id = Number(req.body.assigned_driver_id) || null;

    if (!['approved', 'rejected'].includes(approval_status)) {
      return res.status(400).json({
        message: 'approval_status harus approved atau rejected',
      });
    }

    const [rows] = await db.query(
      'SELECT id, approval_status, requested_day, requested_time FROM schedule_requests WHERE id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Pengajuan jadwal tidak ditemukan',
      });
    }

    if (approval_status === 'approved') {
      await db.query(
        `UPDATE schedule_requests
         SET approval_status = 'approved',
             admin_note = ?,
             approved_day = ?,
             approved_time = ?,
             assigned_driver_id = ?,
             pickup_status = 'pending',
             suggested_day = NULL,
             suggested_time = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          admin_note,
          approved_day || rows[0].requested_day,
          approved_time || rows[0].requested_time,
          assigned_driver_id,
          id,
        ]
      );
    } else {
      await db.query(
        `UPDATE schedule_requests
         SET approval_status = 'rejected',
             admin_note = ?,
             suggested_day = ?,
             suggested_time = ?,
             assigned_driver_id = NULL,
             pickup_status = 'pending',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [admin_note, suggested_day, suggested_time, id]
      );
    }

    logAuditEvent({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'schedule.approval',
      entityType: 'schedule_request',
      entityId: Number(id),
      metadata: {
        approval_status,
        suggested_day,
        suggested_time,
        assigned_driver_id,
      },
    });

    return res.status(200).json({
      message: 'Keputusan admin berhasil disimpan',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat menyimpan keputusan admin',
      error: error.message,
    });
  }
};

const listDriverWeeklyTasks = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sr.id, sr.warga_id, sr.requested_day, sr.requested_time, sr.approved_day, sr.approved_time,
              sr.approval_status, sr.pickup_status, sr.catatan, sr.admin_note,
              sr.assigned_driver_id, sr.weight_kg, sr.earned_points, sr.created_at,
              u.nama AS warga_nama, u.alamat AS warga_alamat
       FROM schedule_requests sr
       JOIN users u ON u.id = sr.warga_id
       WHERE sr.approval_status = 'approved'
         AND (sr.assigned_driver_id IS NULL OR sr.assigned_driver_id = ?)
       ORDER BY FIELD(sr.approved_day, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'), sr.approved_time ASC`,
      [req.user.id]
    );

    return res.status(200).json({
      message: 'Tugas mingguan driver berhasil diambil',
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil tugas driver',
      error: error.message,
    });
  }
};

const updateDriverTaskStatus = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const pickup_status = String(req.body.pickup_status || '').trim();
    const weight_kg = Number(req.body.weight_kg);
    const hasWeight = Number.isFinite(weight_kg) && weight_kg > 0;

    if (!['otw', 'done'].includes(pickup_status)) {
      await connection.rollback();
      return res.status(400).json({
        message: 'pickup_status harus otw atau done',
      });
    }

    const [rows] = await connection.query(
      `SELECT id, warga_id, approval_status, pickup_status, assigned_driver_id
       FROM schedule_requests
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: 'Tugas driver tidak ditemukan',
      });
    }

    const row = rows[0];

    if (row.approval_status !== 'approved') {
      await connection.rollback();
      return res.status(400).json({
        message: 'Tugas belum disetujui admin',
      });
    }

    if (row.assigned_driver_id && row.assigned_driver_id !== req.user.id) {
      await connection.rollback();
      return res.status(403).json({
        message: 'Tugas ini ditugaskan ke driver lain',
      });
    }

    if (pickup_status === 'otw') {
      const [activeRows] = await connection.query(
        `SELECT id
         FROM schedule_requests
         WHERE pickup_status = 'otw'
           AND assigned_driver_id = ?
           AND id <> ?
         LIMIT 1`,
        [req.user.id, id]
      );

      if (activeRows.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          message: 'Driver hanya boleh memiliki satu tugas Otw dalam satu waktu',
        });
      }

      await connection.query(
        `UPDATE schedule_requests
         SET pickup_status = 'otw',
             assigned_driver_id = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [req.user.id, id]
      );

      logAuditEvent({
        actorId: req.user.id,
        actorRole: req.user.role,
        action: 'schedule.driver_otw',
        entityType: 'schedule_request',
        entityId: Number(id),
      });
    } else {
      const points = hasWeight ? Math.round(weight_kg * 3) : 2;

      await connection.query(
        `UPDATE schedule_requests
         SET pickup_status = 'done',
             assigned_driver_id = ?,
             weight_kg = ?,
             earned_points = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [req.user.id, hasWeight ? weight_kg : 0, points, id]
      );

      await connection.query(
        `UPDATE users
         SET saldo_poin = saldo_poin + ?
         WHERE id = ?`,
        [points, row.warga_id]
      );

      await connection.query(
        `INSERT INTO point_history (user_id, jumlah_poin, tipe, keterangan)
         VALUES (?, ?, 'tambah', ?)`,
        [
          row.warga_id,
          points,
          hasWeight
            ? `Tambah poin dari jadwal pickup #${id} dengan berat ${weight_kg} kg`
            : `Tambah poin default dari jadwal pickup #${id} tanpa berat`,
        ]
      );

      logAuditEvent({
        actorId: req.user.id,
        actorRole: req.user.role,
        action: 'schedule.driver_done',
        entityType: 'schedule_request',
        entityId: Number(id),
        metadata: {
          weight_kg: hasWeight ? weight_kg : null,
          points,
          warga_id: row.warga_id,
        },
      });
    }

    await connection.commit();

    return res.status(200).json({
      message: 'Status tugas driver berhasil diperbarui',
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        // Ignore rollback error and keep original error.
      }
    }

    return res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui status tugas driver',
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createScheduleRequest,
  listMySchedules,
  listAdminSchedules,
  updateAdminDecision,
  listDriverWeeklyTasks,
  updateDriverTaskStatus,
};
