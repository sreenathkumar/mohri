import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['woocommerce', 'shopify'],
        required: true
    },
    domain: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);

export default Shop;