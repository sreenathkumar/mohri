import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    address: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
