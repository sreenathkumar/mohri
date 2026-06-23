import mongoose, { Schema } from "mongoose";

const MembershipSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    merchantId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    role: {
        type: String,
        enum: ['clerk', 'driver'],
        required: true
    }
}, { timestamps: true });

// a user from having duplicate memberships in the same shop
MembershipSchema.index({ userId: 1, shopId: 1 }, { unique: true });

const Membership = mongoose.models.Membership || mongoose.model('Membership', MembershipSchema);

export default Membership;