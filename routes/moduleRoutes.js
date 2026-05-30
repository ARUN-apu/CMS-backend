const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    createModule,
    getCourseModules,
    updateModule,
    deleteModule
} = require("../controllers/moduleController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getCourseModules);
router.post("/", protect, authorizeRoles("instructor", "admin"), createModule);
router.put("/:id", protect, authorizeRoles("instructor", "admin"), updateModule);
router.delete("/:id", protect, authorizeRoles("instructor", "admin"), deleteModule);

module.exports = router;