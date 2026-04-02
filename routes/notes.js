const express = require("express");
const router = express.Router();

const {
    getNotes,
    createNote,
    deleteNote,
    updateNote
} = require("../controllers/notesController");

const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, getNotes);
router.post("/", authMiddleware, createNote);
router.delete("/:id", authMiddleware, deleteNote);
router.patch("/:id", authMiddleware, updateNote);

module.exports = router;