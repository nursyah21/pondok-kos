import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxLength: [125, 'nama kos maksimal 125 karakter']
    },
    description: {
        type: String,
        required: true,
        maxLength: [255, 'deskripsi kos maksimal 255 karakter']
    },
    address: {
        type: String,
        required: true,
        maxLength: [125, 'alamat kos maksimal 125 karakter']
    },
    image: {
        type: String,
        maxLength: [255, 'link image maksimal 255 karakter']
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Kos = mongoose.model('kos', Schema);
