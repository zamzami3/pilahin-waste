const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { nama, email, password, no_wa, role, alamat, lat_long } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        message: 'nama, email, dan password wajib diisi',
      });
    }

    if (role && role !== 'warga') {
      return res.status(400).json({
        message: 'Registrasi mandiri hanya untuk role warga',
      });
    }

    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: 'Email sudah terdaftar',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (nama, email, password, no_wa, role, alamat, lat_long)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        email,
        hashedPassword,
        no_wa || null,
        'warga',
        alamat || null,
        lat_long || null,
      ]
    );

    return res.status(201).json({
      message: 'Register berhasil',
      user: {
        id: result.insertId,
        nama,
        email,
        role: 'warga',
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat register',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email dan password wajib diisi',
      });
    }

    const [rows] = await db.query(
      'SELECT id, nama, email, password, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'pilahin_secret_dev',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat login',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
