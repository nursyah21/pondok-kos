import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    token: {
        type: String,
        maxlength: 255,
        required: true,
    },
    last_used: {
        type: Date,
        default: Date.now()
    },
    
    id_user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

export const RefreshTokens = mongoose.model('refresh_tokens', Schema);
