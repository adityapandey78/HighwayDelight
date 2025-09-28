import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { NoteModal } from '../components/NoteModal';
import type { Note, ApiResponse } from '../types';

// Material Icons--
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import NotesIcon from '@mui/icons-material/Notes';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = (await apiService.getNotes()) as ApiResponse<Note[]>;
      if (response.success && response.data) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      const response = (await apiService.createNote(newNote)) as ApiResponse<Note>;
      if (response.success && response.data) {
        setNotes(prev => [response.data!, ...prev]);
        setNewNote({ title: '', content: '' });
        setIsCreating(false);
        setError('');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      setError(errorMessage);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await apiService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note._id !== noteId));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete note';
      setError(errorMessage);
    }
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteId: string, title: string, content: string) => {
    try {
      const response = (await apiService.updateNote(noteId, { title, content })) as ApiResponse<Note>;
      if (response.success && response.data) {
        setNotes(prev => prev.map(note => 
          note._id === noteId ? response.data! : note
        ));
        setSelectedNote(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update note';
      setError(errorMessage);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 content-padding lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <NotesIcon className="text-white text-sm" />
            </div>
            <span className="text-responsive-lg font-bold text-gray-900">Dashboard</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            <LogoutIcon fontSize="small" />
            <span className="hidden xs:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-80 xl:w-96 lg:bg-white lg:shadow-sm lg:border-r lg:border-gray-200">
          <div className="content-padding">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <NotesIcon className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Dashboard</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                <LogoutIcon fontSize="small" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Welcome, {user?.name}!
                </h3>
                <p className="text-sm text-gray-600">Email: {user?.email}</p>
              </div>

              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center space-x-2 w-full btn-primary"
              >
                <AddIcon fontSize="small" />
                <span>Create Note</span>
              </button>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() => handleViewNote(note)}
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 truncate">{note.title}</h5>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewNote(note);
                            }}
                            className="text-blue-500 hover:text-blue-700 text-sm p-1"
                            title="View Note"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note._id);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm p-1"
                            title="Delete Note"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(note.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 section-padding">
          {/* Mobile Welcome Section */}
          <div className="lg:hidden mb-6 card content-padding">
            <h3 className="text-responsive-lg font-semibold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h3>
            <p className="text-responsive-base text-gray-600 mb-4">Email: {user?.email}</p>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center space-x-2 w-full btn-primary"
            >
              <AddIcon fontSize="small" />
              <span>Create Note</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 alert-error">
              {error}
            </div>
          )}

          {/* Create Note Form */}
          {isCreating && (
            <div className="mb-6 card content-padding">
              <h4 className="text-responsive-lg font-semibold text-gray-900 mb-4">Create New Note</h4>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div>
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows={4}
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter note content"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex items-center justify-center space-x-2 btn-primary flex-1 sm:flex-none">
                    <SaveIcon fontSize="small" />
                    <span>Save Note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewNote({ title: '', content: '' });
                      setError('');
                    }}
                    className="flex items-center justify-center space-x-2 btn-secondary flex-1 sm:flex-none"
                  >
                    <CancelIcon fontSize="small" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes Grid */}
          <div className="space-y-4">
            <h4 className="text-responsive-lg font-semibold text-gray-900">Your Notes</h4>
            {notes.length === 0 ? (
              <div className="text-center py-12 card content-padding">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <NoteAddIcon className="text-gray-400 text-3xl" />
                </div>
                <h5 className="text-responsive-base font-medium text-gray-900 mb-2">No notes yet</h5>
                <p className="text-gray-600 mb-4">Create your first note to get started!</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center space-x-2 btn-primary mx-auto"
                >
                  <AddIcon fontSize="small" />
                  <span>Create Note</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">{notes.map((note) => (
                  <div
                    key={note._id}
                    className="card card-hover content-padding cursor-pointer"
                    onClick={() => handleViewNote(note)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-gray-900 truncate pr-2">{note.title}</h5>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewNote(note);
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors duration-200 p-1"
                          title="View Note"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note._id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                          title="Delete Note"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{note.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {formatDate(note.createdAt)}</span>
                      <span>Updated: {formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Modal */}
      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
};

export default Dashboard;