import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength:255,
    },
    description: {
        type: String,
        maxLength:255,
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
        maxLength:255,
    }],
    id_kos: {
        type: mongoose.Schema.ObjectId,
        ref: 'kos',
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const KamarKos = mongoose.model('kamar_kos', Schema);
