const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            isDeleted: false,
            isPublished: true
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const existingEnrollment = await Enrollment.findOne({
            student: req.user.id,
            course: req.params.id
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        const enrollment = await Enrollment.create({
            student: req.user.id,
            course: req.params.id
        });

        await Course.findByIdAndUpdate(req.params.id, {
            $push: { enrolledStudents: req.user.id }
        });

        res.status(201).json({
            message: "Enrolled successfully",
            enrollment
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id })
            .populate("course", "title description thumbnail category instructor");

        res.status(200).json({ enrollments });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;

        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: req.params.id
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        enrollment.progress = progress;
        if (progress === 100) {
            enrollment.completed = true;
        }
        await enrollment.save();

        res.status(200).json({
            message: "Progress updated",
            enrollment
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const unenrollCourse = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: req.params.id
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        await Enrollment.findByIdAndDelete(enrollment._id);

        await Course.findByIdAndUpdate(req.params.id, {
            $pull: { enrolledStudents: req.user.id }
        });

        res.status(200).json({ message: "Unenrolled successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { enrollCourse, getMyEnrollments, updateProgress, unenrollCourse };