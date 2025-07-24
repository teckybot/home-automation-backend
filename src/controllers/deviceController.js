import Device from "../models/Device.js";

// Create a new device
export const createDevice = async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }
    const device = new Device({ name, type });
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all devices
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status (true/false)
// Update device status by name (case-insensitive)
export const updateDeviceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { name } = req.query;

    if (!name) return res.status(400).json({ error: "Device name is required" });
    if (typeof status !== "boolean") return res.status(400).json({ error: "Status must be true or false" });

    const updated = await Device.findOneAndUpdate(
      { name: new RegExp(`^${name}$`, "i") },
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: `Device '${name}' not found` });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete a device
// Delete device by name (case-insensitive)
export const deleteDevice = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Device name is required" });
    }

    const deleted = await Device.findOneAndDelete({
      name: new RegExp(`^${name}$`, "i")  // case-insensitive match
    });

    if (!deleted) {
      return res.status(404).json({ error: `Device '${name}' not found` });
    }

    res.json({ success: true, deleted: deleted.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

