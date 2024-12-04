import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    verified: boolean;
    resetPasswordCounter: number;
    resettingExpiresIn: Date | null;
}

const UserSchema = new Schema<IUser>({

    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    verified: {
        type: Boolean,
        default: false,
    },

    resetPasswordCounter: {
        type: Number,
        default: 0,
    },

    resettingExpiresIn: {
        type: Date,
        default: null,
    },

}, { timestamps: true });

export const Users = mongoose.models.Users || mongoose.model<IUser>('Users', UserSchema);
