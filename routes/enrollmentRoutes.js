const express = require("express");
const router = express.Router();
const {
    enrollCourse,
    getMyEnrollments,
    updateProgress,
    unenrollCourse
} = require("../controllers/enrollmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/:id/enroll", protect, authorizeRoles("student"), enrollCourse);
router.get("/my-enrollments", protect, authorizeRoles("student"), getMyEnrollments);
router.put("/:id/progress", protect, authorizeRoles("student"), updateProgress);
router.delete("/:id/unenroll", protect, authorizeRoles("student"), unenrollCourse);

module.exports = router;