const Module = require("../models/Module");
const Course = require("../models/Course");

const createModule = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.courseId,
            isDeleted: false
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { title, description, order } = req.body;

        const module = await Module.create({
            title,
            description,
            order,
            course: req.params.courseId
        });

        res.status(201).json({
            message: "Module created successfully",
            module
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCourseModules = async (req, res) => {
    try {
        const modules = await Module.find({
            course: req.params.courseId,
            isDeleted: false
        }).sort({ order: 1 });

        res.status(200).json({ modules });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateModule = async (req, res) => {
    try {
        const module = await Module.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        const course = await Course.findById(module.course);
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedModule = await Module.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Module updated successfully",
            module: updatedModule
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteModule = async (req, res) => {
    try {
        const module = await Module.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        const course = await Course.findById(module.course);
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        module.isDeleted = true;
        await module.save();

        res.status(200).json({ message: "Module deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createModule, getCourseModules, updateModule, deleteModule };