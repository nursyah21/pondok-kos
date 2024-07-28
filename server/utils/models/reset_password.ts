import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    secret_key: {
        type: String,
        required: true,
    },
    id_user: {
        type: String,
        required: true
    },
    reset: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const ResetPassword = mongoose.model('reset_password', Schema);
