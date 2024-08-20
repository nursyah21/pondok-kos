import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    id_kos: {
        type: mongoose.Schema.ObjectId,
        ref: 'kos',
        required: true,
    },
}, { timestamps: true })

export const PenjagaKos = mongoose.model('penjaga_kos', Schema);
