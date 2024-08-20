import mongoose, { Document, Schema } from 'mongoose';

// Görev modelinin arayüzü
export interface ITask extends Document {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

// Görev şeması
const taskSchema: Schema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, required: true }
});

// Model oluşturma
export const TaskModel = mongoose.model<ITask>('Task', taskSchema);
