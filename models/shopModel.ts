import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['woocommerce', 'shopify'],
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: false
    },
});

const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);

export default Shop;