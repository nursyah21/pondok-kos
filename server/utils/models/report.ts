import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    report_message: {
        type: String,
        required: true,
    },
    fix_status: {
        type: Number,
        default: 0
    },
    id_kos: {
        type: mongoose.Schema.Types.ObjectId,
    },
    id_sender: {
        type: mongoose.Schema.Types.ObjectId,
    },
    attachments: {
        type: mongoose.Schema.Types.ObjectId,
    },
}, { timestamps: true })

export const Report = mongoose.model('report', Schema);
