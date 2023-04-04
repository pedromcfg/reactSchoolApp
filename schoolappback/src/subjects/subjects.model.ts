import * as mongoose from 'mongoose';

export const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user_id: { type: String, required: false },
});

SubjectSchema.set('timestamps', true);

export interface Subject extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  user_id: string;
};