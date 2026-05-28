const Course = require("../models/Course");

const createCourse = async (req, res) => {
    try {
        const { title, description, category, price, thumbnail } = req.body;

        const course = await Course.create({
            title,
            description,
            category,
            price,
            thumbnail,
            instructor: req.user.id
        });

        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isDeleted: false, isPublished: true })
            .populate("instructor", "name email");

        res.status(200).json({ courses });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, isDeleted: false })
            .populate("instructor", "name email");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ course });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, isDeleted: false });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this course" });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, isDeleted: false });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this course" });
        }

        course.isDeleted = true;
        await course.save();

        res.status(200).json({ message: "Course deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };