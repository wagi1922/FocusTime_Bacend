const { validationResult } = require('express-validator');
const Class = require('../models/Class');

class ClassController {
  // Membuat kelas baru
  async createClass(req, res) {
    const { name } = req.body;
    const teacherId = req.user.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const classCode = await generateClassCode();
      const newClass = new Class({
        name,
        teacherId,
        code: classCode,
      });
      await newClass.save();
      res.status(201).json({
        message: 'Class created successfully',
        data: newClass,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Mendapatkan kode kelas
  async getClassCode(req, res) {
    try {
      const classData = await Class.findById(req.params.classId);
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json({ classId: classData._id, code: classData.code });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Bergabung ke dalam kelas
  async joinClass(req, res) {
    const { code } = req.body;
    const userId = req.user.userId;

    if (!code) {
      return res.status(400).json({ message: 'Class code is required' });
    }

    try {
      const foundClass = await Class.findOne({ code });
      if (!foundClass) {
        return res.status(404).json({ message: 'Class not found' });
      }

      if (foundClass.students.includes(userId)) {
        return res.status(400).json({ message: 'You are already a member of this class' });
      }

      foundClass.students.push(userId);
      await foundClass.save();

      res.status(200).json({ message: 'Successfully joined the class', classId: foundClass._id });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Mengupdate informasi kelas
  async updateClass(req, res) {
    const { classId } = req.params;
    const { name} = req.body;
    const teacherId = req.user.userId;

    try {
      const classData = await Class.findById(classId);

      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }

      if (classData.teacherId.toString() !== teacherId) {
        return res.status(403).json({ message: 'You are not authorized to update this class' });
      }

      if (name) classData.name = name;

      await classData.save();
      res.status(200).json({ message: 'Class updated successfully', data: classData });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Menghapus kelas
  async deleteClass(req, res) {
    const { classId } = req.params;
    const teacherId = req.user.userId;

    try {
      const classData = await Class.findById(classId);

      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }

      if (classData.teacherId.toString() !== teacherId) {
        return res.status(403).json({ message: 'You are not authorized to delete this class' });
      }

      await classData.deleteOne();
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Keluar dari kelas
  async leaveClass(req, res) {
    const { classId } = req.params;
    const userId = req.user.userId;

    try {
      const classData = await Class.findById(classId);

      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }

      const studentIndex = classData.students.indexOf(userId);
      if (studentIndex === -1) {
        return res.status(400).json({ message: 'You are not a member of this class' });
      }

      classData.students.splice(studentIndex, 1);
      await classData.save();

      res.status(200).json({ message: 'Successfully left the class' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getClassMembers(req, res) {
    const { classId } = req.params;
  
    try {
      const classData = await Class.findById(classId).populate('students', 'username email'); // Populate nama dan email dari koleksi User
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      res.status(200).json({
        message: 'Class members retrieved successfully',
        data: classData.students,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
    // Melihat daftar kelas yang dibuat oleh guru
    async getClassesByTeacher(req, res) {
      try {
        // Validasi apakah `req.user` ada dan memiliki `userId`
        const teacherId = req.user?.userId;
        if (!teacherId) {
          return res.status(400).json({ message: 'Invalid user ID or user not authenticated' });
        }
    
        // Cari semua kelas yang dibuat oleh guru berdasarkan teacherId
        const classes = await Class.find({ teacherId });
    
        // Jika tidak ada kelas ditemukan
        if (!classes || classes.length === 0) {
          return res.status(404).json({ message: 'No classes found for this teacher' });
        }
    
        // Berhasil mendapatkan daftar kelas
        res.status(200).json({
          message: 'Classes retrieved successfully',
          data: classes,
        });
      } catch (error) {
        // Menangani error server
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    }
    

  // Melihat daftar kelas yang diikuti oleh siswa
  async getJoinedClasses(req, res) {
    const studentId = req.user.userId;
  
    try {
      // Query untuk mencari kelas yang berisi `studentId` di dalam array `students`
      const classes = await Class.find({ students: studentId }).populate('students', 'name email');
      if (!classes || classes.length === 0) {
        return res.status(404).json({ message: 'No joined classes found' });
      }
  
      res.status(200).json({
        message: 'Joined classes retrieved successfully',
        data: classes,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async viewClassDetails(req, res) {
    const { classId } = req.params;
    
    try {
      const classData = await Class.findById(classId).populate('teacherId', 'name email');  // Populate nama dan email dari guru
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      res.status(200).json({
        message: 'Class details retrieved successfully',
        data: classData,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
}


// Fungsi untuk menghasilkan kode kelas unik
const generateClassCode = async () => {
  let classCode;
  do {
    classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (await Class.exists({ code: classCode }));
  return classCode;
};

module.exports = new ClassController();
