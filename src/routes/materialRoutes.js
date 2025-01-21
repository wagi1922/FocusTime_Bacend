const express = require('express');
const { 
  addMaterial, 
  getMaterials, 
  getMaterialById, 
  updateMaterial, 
  deleteMaterial 
} = require('../controllers/materialController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @typedef {object} AddMaterialRequest
 * @property {string} title.required - Judul bahan pelajaran
 * @property {string} description.required - Deskripsi bahan pelajaran
 * @property {string} documentLink.required - Link dokumen bahan pelajaran
 */

/**
 * @typedef {object} MaterialResponse
 * @property {string} id - ID bahan pelajaran
 * @property {string} classId - ID kelas
 * @property {string} title - Judul bahan pelajaran
 * @property {string} description - Deskripsi bahan pelajaran
 * @property {string} documentLink - Link file dokumen
 */

/**
 * POST /api/materials/:classId/create
 * @summary Menambahkan bahan pelajaran baru
 * @tags Materials
 * @param {AddMaterialRequest} request.body.required - Data bahan pelajaran
 * @security BearerAuth
 * @return {MaterialResponse} 201 - Bahan pelajaran berhasil ditambahkan
 * @return {object} 400 - Data yang dikirim tidak valid
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.post('/:classId/create', authMiddleware, addMaterial);

/**
 * @typedef {object} GetMaterialsResponse
 * @property {array<MaterialResponse>} materials - Daftar bahan pelajaran
 */

/**
 * GET /api/materials/{classId}
 * @summary Mendapatkan semua bahan pelajaran berdasarkan ID kelas
 * @tags Materials
 * @param {string} classId.path.required - ID kelas
 * @return {GetMaterialsResponse} 200 - Daftar bahan pelajaran
 * @return {object} 404 - Tidak ditemukan bahan pelajaran
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/:classId', getMaterials);

/**
 * GET /api/materials/detail/{materialId}
 * @summary Mendapatkan detail bahan pelajaran berdasarkan ID
 * @tags Materials
 * @param {string} materialId.path.required - ID bahan pelajaran
 * @return {MaterialResponse} 200 - Detail bahan pelajaran
 * @return {object} 404 - Bahan pelajaran tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.get('/detail/:materialId', getMaterialById);

/**
 * PUT /api/materials/{materialId}
 * @summary Memperbarui data bahan pelajaran
 * @tags Materials
 * @param {string} materialId.path.required - ID bahan pelajaran
 * @param {AddMaterialRequest} request.body.required - Data bahan pelajaran yang diperbarui
 * @security BearerAuth
 * @return {MaterialResponse} 200 - Bahan pelajaran berhasil diperbarui
 * @return {object} 404 - Bahan pelajaran tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.put('/:materialId', authMiddleware, updateMaterial);

/**
 * DELETE /api/materials/{materialId}
 * @summary Menghapus bahan pelajaran
 * @tags Materials
 * @param {string} materialId.path.required - ID bahan pelajaran
 * @security BearerAuth
 * @return {object} 200 - Bahan pelajaran berhasil dihapus
 * @return {object} 404 - Bahan pelajaran tidak ditemukan
 * @return {object} 500 - Terjadi kesalahan pada server
 */
router.delete('/:materialId', authMiddleware, deleteMaterial);

module.exports = router;
