import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user
NoteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INote>('Note', NoteSchema);