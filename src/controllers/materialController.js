const Material = require('../models/Material');

// Tambahkan bahan pelajaran
exports.addMaterial = async (req, res) => {
  const { classId } = req.params;
  const { title, description, documentLink } = req.body;

  if (!documentLink) {
    return res.status(400).json({ message: 'Document link is required' });
  }

  try {
    const newMaterial = new Material({
      classId,
      title,
      description,
      documentLink
    });

    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (err) {
    res.status(500).json({ message: 'Error saving material', details: err.message });
  }
};

// Ambil semua bahan pelajaran
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ classId: req.params.classId });
    res.status(200).json({data : materials});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Perbarui bahan pelajaran
exports.updateMaterial = async (req, res) => {
  const { materialId } = req.params;
  const { title, description, documentLink } = req.body;

  try {
    const updatedMaterial = await Material.findByIdAndUpdate(
      materialId,
      { title, description, documentLink },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json(updatedMaterial);
  } catch (err) {
    res.status(500).json({ message: 'Error updating material', details: err.message });
  }
};

// Hapus bahan pelajaran
exports.deleteMaterial = async (req, res) => {
  const { materialId } = req.params;

  try {
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await Material.findByIdAndDelete(materialId);

    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting material', details: err.message });
  }
};
