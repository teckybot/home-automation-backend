import express from "express";
import {
  createDevice,
  getDevices,
  updateDeviceSwitch,
  updateDeviceStatus,
  deleteDevice,
  editDevice
} from "../controllers/deviceController.js";

import{
  getDeviceSwitchStatus,
  getDeviceStatusAndToggle,
  setSwitchIfDeviceOnline
} from "../controllers/devcontrollers.js";

const router = express.Router();

// Routes
router.post("/", createDevice);
router.get("/", getDevices);
router.put("/switch", updateDeviceSwitch);
router.put("/status", updateDeviceStatus);
router.delete("/delete", deleteDevice);
router.put("/:id", editDevice); 


// Developer APIs
router.get("/:name/status", getDeviceSwitchStatus);           
router.get("/:name/status/toggle", getDeviceStatusAndToggle); 
router.get("/setSwitch", setSwitchIfDeviceOnline);                     

export default router;
