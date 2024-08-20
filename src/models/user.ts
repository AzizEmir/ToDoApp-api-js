import mongoose, { Document, Schema } from 'mongoose';

// Kullanıcı modelinin arayüzü
export interface IUser extends Document {
    id:string,
    username: string;
    password: string;
    email: string; 
}

// Kullanıcı şeması
const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

// Model oluşturma
export const UserModel = mongoose.model<IUser>('User', userSchema);
