import express from "express";
import {
  createDevice,
  getDevices,
  updateDeviceStatus,
  deleteDevice,
} from "../controllers/deviceController.js";

const router = express.Router();

// Routes
router.post("/", createDevice);
router.get("/", getDevices);
router.put("/status", updateDeviceStatus);
router.delete("/delete", deleteDevice);

export default router;
