import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    secret_key: {
        type: String,
        maxlength:255,
        required: true,
    },
    id_user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    reset: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const ResetPassword = mongoose.model('reset_password', Schema);
