import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [125, 'nama kos maksimal 125 karakter'],
    },
    description: {
        type: String,
        maxLength: [255, 'deskripsi kos maksimal 255 karakter']
    },
    available: {
        type: Number,
        default: 0 // 0 tersedia, 1 sedang dipesan, 2 ditempati
    },
    price: {
        type: Number,
        min: [10_000, 'harga minimal 10rb'],
        max: [10_000_000, 'harga maksimal 10jt']
    },
    price_harian: {
        type: Number,
        default: 0, // 0 it mean only bulanan not harian
        min: [10_000, 'harga minimal 10rb'],
        max: [10_000_000, 'harga maksimal 10jt']
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
