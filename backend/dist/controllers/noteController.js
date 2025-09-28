"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNotes = void 0;
const Note_1 = __importDefault(require("../models/Note"));
const getNotes = async (req, res) => {
    try {
        const notes = await Note_1.default.find({ userId: req.user._id }).sort({ createdAt: -1 });
        const response = {
            success: true,
            message: 'Notes retrieved successfully',
            data: notes,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get notes error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.getNotes = getNotes;
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            const response = {
                success: false,
                message: 'Please provide title and content',
            };
            res.status(400).json(response);
            return;
        }
        const note = await Note_1.default.create({
            title,
            content,
            userId: req.user._id,
        });
        const response = {
            success: true,
            message: 'Note created successfully',
            data: note,
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Create note error:', error);
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map((val) => val.message).join(', ');
            const response = {
                success: false,
                message,
            };
            res.status(400).json(response);
            return;
        }
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const note = await Note_1.default.findOne({ _id: id, userId: req.user._id });
        if (!note) {
            const response = {
                success: false,
                message: 'Note not found',
            };
            res.status(404).json(response);
            return;
        }
        const updatedNote = await Note_1.default.findByIdAndUpdate(id, { title, content }, { new: true, runValidators: true });
        const response = {
            success: true,
            message: 'Note updated successfully',
            data: updatedNote,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Update note error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note_1.default.findOne({ _id: id, userId: req.user._id });
        if (!note) {
            const response = {
                success: false,
                message: 'Note not found',
            };
            res.status(404).json(response);
            return;
        }
        await Note_1.default.findByIdAndDelete(id);
        const response = {
            success: true,
            message: 'Note deleted successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Delete note error:', error);
        const response = {
            success: false,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
};
exports.deleteNote = deleteNote;
//# sourceMappingURL=noteController.js.map