const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    videoUrl: {
        type: String,
        default: ""
    },
    duration: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        required: true
    },
    isFree: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);