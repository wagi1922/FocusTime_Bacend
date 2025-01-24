const express = require('express');
const router = express.Router();
const { 
  createAssignment, 
  getAssignment, 
  updateAssignment, 
  deleteAssignment, 
  submitAnswer,
  getAssignmentById 
} = require('../controllers/assignmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const classMiddleware = require('../middlewares/classMiddleware.')

/**
 * @typedef {object} CreateAssignmentRequest
 * @property {string} title.required - Judul tugas
 * @property {string} instructions.required - Instruksi tugas
 * @property {string} documentLink.required - Link dokumen tugas
 * @property {Date} deadline.registered - Deadline tugas
 */

/**
 * @typedef {object} SubmitAnswerRequest
 * @property {string} answerLink.required - Link jawaban siswa
 */

/**
 * @typedef {object} AssignmentResponse
 * @property {string} message - Pesan respon
 * @property {object} [data] - Data tugas (opsional)
 */

/**
 * POST /api/assignments/:classId/create
 * @summary Membuat tugas baru
 * @tags Assignments
 * @param {CreateAssignmentRequest} request.body.required - Data tugas yang akan dibuat
 * @security BearerAuth
 * @return {AssignmentResponse} 201 - Tugas berhasil dibuat
 * @return {object} 400 - Data tidak valid
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/:classId/create', authMiddleware, createAssignment);

/**
 * GET /api/assignments/{classId}
 * @summary Mendapatkan daftar tugas berdasarkan ID kelas
 * @tags Assignments
 * @param {string} classId.path.required - ID kelas
 * @return {AssignmentResponse} 200 - Detail tugas ditemukan
 * @return {object} 404 - Tugas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/:classId', getAssignment);

/**
 * PUT /api/assignments/:assignmentId
 * @summary Memperbarui tugas berdasarkan ID
 * @tags Assignments
 * @param {string} assignmentId.path.required - ID tugas
 * @param {CreateAssignmentRequest} request.body.required - Data tugas yang akan diperbarui
 * @security BearerAuth
 * @return {AssignmentResponse} 200 - Tugas berhasil diperbarui
 * @return {object} 404 - Tugas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.put('/:assignmentId', authMiddleware, updateAssignment);

/**
 * DELETE /api/assignments/:assignmentId
 * @summary Menghapus tugas berdasarkan ID
 * @tags Assignments
 * @param {string} assignmentId.path.required - ID tugas
 * @security BearerAuth
 * @return {AssignmentResponse} 200 - Tugas berhasil dihapus
 * @return {object} 404 - Tugas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.delete('/:assignmentId', authMiddleware, deleteAssignment);

/**
 * POST /api/assignments/:assignmentId/submit
 * @summary Mengumpulkan jawaban untuk tugas berdasarkan ID tugas
 * @tags Assignments
 * @param {string} assignmentId.path.required - ID tugas
 * @param {SubmitAnswerRequest} request.body.required - Link jawaban siswa
 * @security BearerAuth
 * @return {AssignmentResponse} 201 - Jawaban berhasil dikumpulkan
 * @return {object} 400 - Data tidak valid
 * @return {object} 404 - Tugas tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/:assignmentId/submit', classMiddleware, submitAnswer);


module.exports = router;
