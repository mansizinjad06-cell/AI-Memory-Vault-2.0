const express = require("express");
const Memory = require("../models/Memory");

const router = express.Router();

// ==========================================
// GET ALL MEMORIES - METADATA ONLY
// ==========================================

router.get("/", async (req, res) => {
  try {
    const memories = await Memory.find()
      .select("-fileData")
      .sort({
        createdAt: -1,
      });

    res.json(memories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch memories",
    });
  }
});

// ==========================================
// GET ONE MEMORY FILE DATA
// ==========================================

router.get("/:id/file", async (req, res) => {
  try {
    const memory = await Memory.findById(
      req.params.id
    ).select("fileData type fileName fileType mimeType");

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    res.json({
      id: memory._id,
      type: memory.type,
      fileName: memory.fileName || "",
      fileType:
        memory.fileType ||
        memory.mimeType ||
        "",
      fileData: memory.fileData || "",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch file data",
    });
  }
});

// ==========================================
// ADD NEW MEMORY
// ==========================================

router.post("/", async (req, res) => {
  try {
    const memory = new Memory(req.body);

    const savedMemory =
      await memory.save();

    res.status(201).json(savedMemory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save memory",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE MEMORY
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const updatedMemory =
      await Memory.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!updatedMemory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    res.json(updatedMemory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update memory",
    });
  }
});

// ==========================================
// DELETE MEMORY
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const deletedMemory =
      await Memory.findByIdAndDelete(
        req.params.id
      );

    if (!deletedMemory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    res.json({
      message:
        "Memory deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete memory",
    });
  }
});

module.exports = router;