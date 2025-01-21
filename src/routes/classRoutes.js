const express = require('express');
const {
  createClass,
  getClassCode,
  joinClass,
  updateClass,
  deleteClass,
  leaveClass,
  getClassMembers,
  getClassesByTeacher,
  getJoinedClasses,
  viewClassDetails,
} = require('../controllers/classController');
const authMiddleware = require('../middlewares/authMiddleware');
const classMiddleware = require('../middlewares/classMiddleware.')

const router = express.Router();

/**
 * @typedef {object} CreateClassRequest
 * @property {string} name.required - Nama kelas
 */

/**
 * @typedef {object} JoinClassRequest
 * @property {string} code.required - Kode kelas yang akan dimasuki
 */

/**
 * @typedef {object} UpdateClassRequest
 * @property {string} name.optional - Nama kelas baru
 */

/**
 * @typedef {object} ClassResponse
 * @property {string} message - Pesan respon
 * @property {object} [data] - Data kelas yang dibuat, diakses, atau diperbarui
 */

/**
 * @typedef {object} GetClassCodeResponse
 * @property {string} classId - ID kelas
 * @property {string} code - Kode unik kelas
 */

/**
 * POST /api/classes/create
 * @summary Membuat kelas baru
 * @tags Class
 * @param {CreateClassRequest} request.body.required - Data untuk membuat kelas
 * @return {ClassResponse} 201 - Kelas berhasil dibuat
 * @return {object} 400 - Kesalahan validasi data
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/create', classMiddleware, createClass);

/**
 * GET /api/classes/{classId}/code
 * @summary Mendapatkan kode kelas berdasarkan ID kelas
 * @tags Class
 * @param {string} classId.path.required - ID kelas
 * @return {GetClassCodeResponse} 200 - Kode kelas berhasil ditemukan
 * @return {object} 404 - Kelas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/:classId/code', classMiddleware, getClassCode);

/**
 * POST /api/classes/join
 * @summary Bergabung ke dalam kelas menggunakan kode kelas
 * @tags Class
 * @param {JoinClassRequest} request.body.required - Data untuk bergabung ke kelas
 * @return {ClassResponse} 200 - Berhasil bergabung ke kelas
 * @return {object} 400 - Kesalahan validasi (kode kelas kosong atau sudah bergabung)
 * @return {object} 404 - Kelas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/join', classMiddleware, joinClass);

/**
 * GET /api/classes/teacher
 * @summary Melihat daftar kelas yang dibuat oleh guru
 * @tags Class
 * @return {ClassResponse} 200 - Daftar kelas berhasil ditemukan
 * @return {object} 404 - Tidak ada kelas ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/teacher', classMiddleware, getClassesByTeacher);

/**
 * GET /api/classes/student
 * @summary Melihat daftar kelas yang diikuti oleh siswa
 * @tags Class
 * @return {ClassResponse} 200 - Daftar kelas berhasil ditemukan
 * @return {object} 404 - Tidak ada kelas ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/student', classMiddleware, getJoinedClasses);

/**
 * PUT /api/classes/{classId}
 * @summary Memperbarui informasi kelas
 * @tags Class
 * @param {string} classId.path.required - ID kelas yang ingin diperbarui
 * @param {UpdateClassRequest} request.body.required - Data baru untuk memperbarui kelas
 * @return {ClassResponse} 200 - Kelas berhasil diperbarui
 * @return {object} 404 - Kelas tidak ditemukan
 * @return {object} 403 - Tidak diizinkan memperbarui kelas
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.put('/:classId', classMiddleware, updateClass);

/**
 * DELETE /api/classes/{classId}
 * @summary Menghapus kelas
 * @tags Class
 * @param {string} classId.path.required - ID kelas yang ingin dihapus
 * @return {ClassResponse} 200 - Kelas berhasil dihapus
 * @return {object} 404 - Kelas tidak ditemukan
 * @return {object} 403 - Tidak diizinkan menghapus kelas
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.delete('/:classId', classMiddleware, deleteClass);

/**
 * POST /api/classes/{classId}/leave
 * @summary Keluar dari kelas
 * @tags Class
 * @param {string} classId.path.required - ID kelas yang ingin ditinggalkan
 * @return {ClassResponse} 200 - Berhasil keluar dari kelas
 * @return {object} 404 - Kelas tidak ditemukan
 * @return {object} 400 - Siswa tidak terdaftar di kelas
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/:classId/leave', classMiddleware, leaveClass);

/**
 * GET /api/classes/{classId}/members
 * @summary Melihat member dalam kelas
 * @tags Class
 * @param {string} classId.path.required - ID kelas yang ingin melihat membernya
 * @return {ClassResponse} 200 - Daftar member kelas berhasil ditemukan
 * @return {object} 404 - Kelas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/:classId/members', authMiddleware, getClassMembers);

/**
 * GET /api/classes/{classId}/details
 * @summary Melihat detail kelas berdasarkan ID kelas
 * @tags Class
 * @param {string} classId.path.required - ID kelas
 * @return {ClassResponse} 200 - Detail kelas berhasil ditemukan
 * @return {object} 404 - Kelas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/:classId/details', classMiddleware, viewClassDetails);


module.exports = router;
