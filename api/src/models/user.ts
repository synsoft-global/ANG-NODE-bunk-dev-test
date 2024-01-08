import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    phone: number;
}

const userSchema = new Schema<IUser>(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number, },
    },
    {
        timestamps: true, // Add this line to enable timestamps
    }
);

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
