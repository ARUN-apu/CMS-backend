const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Course = require("../models/Course");

const createLesson = async (req, res) => {
    try {
        const module = await Module.findOne({
            _id: req.params.moduleId,
            isDeleted: false
        });

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        const course = await Course.findById(module.course);
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { title, description, videoUrl, duration, order, isFree } = req.body;

        const lesson = await Lesson.create({
            title,
            description,
            videoUrl,
            duration,
            order,
            isFree,
            module: req.params.moduleId,
            course: module.course
        });

        res.status(201).json({
            message: "Lesson created successfully",
            lesson
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getModuleLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({
            module: req.params.moduleId,
            isDeleted: false
        }).sort({ order: 1 });

        res.status(200).json({ lessons });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const course = await Course.findById(lesson.course);
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Lesson updated successfully",
            lesson: updatedLesson
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const course = await Course.findById(lesson.course);
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        lesson.isDeleted = true;
        await lesson.save();

        res.status(200).json({ message: "Lesson deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createLesson, getModuleLessons, updateLesson, deleteLesson };