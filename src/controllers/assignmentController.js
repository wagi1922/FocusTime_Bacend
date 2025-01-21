const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  try {
    const { classId } = req.params;
    const { title, instructions, documentLink, deadline } = req.body;

    if (!title || !instructions || !documentLink) {
      return res.status(400).json({ message: 'Title, instructions, and document link are required' });
    }

    const newAssignment = new Assignment({
      classId,
      title,
      instructions,
      documentLink,
      deadline: deadline ? new Date(deadline) : null,
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created successfully', data: newAssignment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment', details: error.message });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: 'classId is required' });
    }

    const assignments = await Assignment.find({ classId });
    if (assignments.length === 0) {
      return res.status(404).json({ message: 'No assignments found for this class' });
    }

    res.status(200).json({ message: 'Assignments retrieved successfully', data: assignments });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving assignments', details: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, instructions, documentLink, deadline } = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      {
        title,
        instructions,
        documentLink,
        deadline: deadline ? new Date(deadline) : null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment updated successfully', data: updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment', details: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);
    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', details: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { documentLink } = req.body;
    const userId = req.user.userId;

    if (!documentLink) {
      return res.status(400).json({ message: 'Document link is required' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const existingAnswer = assignment.answer.find(answer => answer.studentId.toString() === userId.toString());
    if (existingAnswer) {
      return res.status(400).json({ message: 'You have already submitted an answer' });
    }

    const newAnswer = {
      studentId: userId,
      documentLink,
      submittedAt: new Date(),
    };

    assignment.answer.push(newAnswer);
    await assignment.save();

    res.status(201).json({ message: 'Answer submitted successfully', data: newAnswer });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting answer', details: error.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching material', details: err.message });
  }
};