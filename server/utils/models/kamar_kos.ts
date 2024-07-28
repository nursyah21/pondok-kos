import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    available: {
        type: Number,
        default: 0 // 0 tersedia, 1 sedang dipesan, 2 ditempati
    },
    price: {
        type: Number,
        default: 1
    },
    price_harian: {
        type: Number,
        default: 0 // 0 it mean only bulanan not harian
    },
    image: [{
        type: String,
    }],
    id_kos: {
        type: String,
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const KamarKos = mongoose.model('kamar_kos', Schema);
