const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const authController = new AuthController();

/**
 * @typedef {object} RegisterRequest
 * @property {string} username.required - Username user
 * @property {string} email.required - Email user
 * @property {string} password.required - Password user
 * @property {string} birthDate.required - Tanggal lahir user (YYYY-MM-DD)
 * @property {string} role.required - Role user - enum:teacher,student
 */

/**
 * @typedef {object} LoginRequest
 * @property {string} email.required - Email user
 * @property {string} password.required - Password user
 */

/**
 * @typedef {object} AuthResponse
 * @property {string} message - Pesan respon
 * @property {object} [data] - Data tambahan (opsional)
 */

/**
 * POST /api/auth/register
 * @summary Mendaftarkan pengguna baru
 * @tags Authentication
 * @param {RegisterRequest} request.body.required - Data pengguna baru
 * @return {AuthResponse} 201 - User berhasil didaftarkan
 * @return {object} 400 - Username sudah ada
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * @summary Login pengguna
 * @tags Authentication
 * @param {LoginRequest} request.body.required - Data login
 * @return {AuthResponse} 200 - Login berhasil dengan token
 * @return {object} 401 - Kredensial tidak valid
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/profile
 * @summary Melihat profil pengguna
 * @tags Authentication
 * @return {AuthResponse} 200 - Profil user berhasil diambil
 * @return {object} 404 - User tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/profile',authMiddleware, authController.viewProfile);

module.exports = router;
