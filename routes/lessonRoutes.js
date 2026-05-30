const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    createLesson,
    getModuleLessons,
    updateLesson,
    deleteLesson
} = require("../controllers/lessonController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getModuleLessons);
router.post("/", protect, authorizeRoles("instructor", "admin"), createLesson);
router.put("/:id", protect, authorizeRoles("instructor", "admin"), updateLesson);
router.delete("/:id", protect, authorizeRoles("instructor", "admin"), deleteLesson);

module.exports = router;