import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    hidden: {
        type: Number,
        default: 0
    },
    id_receipents: {
        type: mongoose.Schema.Types.ObjectId,
    },
    id_sender: {
        type: mongoose.Schema.Types.ObjectId,
    },
    attachments: {
        type: mongoose.Schema.Types.ObjectId,
    },
}, { timestamps: true })

export const Message = mongoose.model('message', Schema);
