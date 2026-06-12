import mongoose, { Schema } from "mongoose";


const AuthCodeSchema = new Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    challenge: {
        type: String,
        required: true
    },
    shop:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date, 
        default: Date.now, 
    }
});

const AuthCode = mongoose.models.AuthCode || mongoose.model('AuthCode', AuthCodeSchema);

export default AuthCode;