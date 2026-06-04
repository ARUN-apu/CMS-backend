const express = require("express");
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getMyCourses
} = require("../controllers/courseController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/my-courses", protect, authorizeRoles("instructor", "admin"), getMyCourses);
router.post("/", protect, authorizeRoles("instructor", "admin"), createCourse);
router.put("/:id", protect, authorizeRoles("instructor", "admin"), updateCourse);
router.delete("/:id", protect, authorizeRoles("instructor", "admin"), deleteCourse);

module.exports = router;