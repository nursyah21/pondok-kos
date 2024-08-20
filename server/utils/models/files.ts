import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        maxlength:255,
        required: true,
    },
    link: {
        type: String,
        maxlength:255,
        required: true,
    },
    type: {
        type: String, //mp4, mp3
        default: 'other'
    },
    size: {
        type: Number
    },
    id_owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }
    
}, { timestamps: true })

export const Files = mongoose.model('files', Schema);
