import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    id_user: {
        type: String,
        required: true,
    },
    id_kos: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export const PenjagaKos = mongoose.model('penjaga_kos', Schema);
