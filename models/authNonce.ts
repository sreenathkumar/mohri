import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOAuthState extends Document {
    nonce: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const AuthNonceSchema: Schema<IOAuthState> = new Schema({
    nonce: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Date, default: Date.now, expires: 600 } // auto-delete after 10 min
});

export const AuthNonce: Model<IOAuthState> =
    mongoose.models.AuthNonce || mongoose.model<IOAuthState>('AuthNonce', AuthNonceSchema);
