import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    id_kos: {
        type: mongoose.Schema.Types.ObjectId,
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    attachments: {
        type: mongoose.Schema.Types.ObjectId,
    },
}, { timestamps: true })

export const Expense = mongoose.model('expense', Schema);
