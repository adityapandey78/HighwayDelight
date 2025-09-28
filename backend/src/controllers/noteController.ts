import { Request, Response } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../types';

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ userId: req.user!._id }).sort({ createdAt: -1 });

    const response: ApiResponse = {
      success: true,
      message: 'Notes retrieved successfully',
      data: notes,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Get notes error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide title and content',
      };
      res.status(400).json(response);
      return;
    }

    const note = await Note.create({
      title,
      content,
      userId: req.user!._id,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Note created successfully',
      data: note,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Create note error:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((val: any) => val.message).join(', ');
      const response: ApiResponse = {
        success: false,
        message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOne({ _id: id, userId: req.user!._id });
    if (!note) {
      const response: ApiResponse = {
        success: false,
        message: 'Note not found',
      };
      res.status(404).json(response);
      return;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Update note error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, userId: req.user!._id });
    if (!note) {
      const response: ApiResponse = {
        success: false,
        message: 'Note not found',
      };
      res.status(404).json(response);
      return;
    }

    await Note.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Note deleted successfully',
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Delete note error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};