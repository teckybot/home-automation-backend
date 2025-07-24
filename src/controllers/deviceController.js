import Device from "../models/Device.js";

// Create a new device
export const createDevice = async (req, res) => {
  try {
    let { name, type } = req.body;

    if (!type) {
      type = "fan"; // default type
    }

    // If no name provided, generate the next available D<number>
    if (!name) {
      const devices = await Device.find({ name: /^D\d+$/ }).sort({ name: 1 });
      let nextNumber = 1;

      if (devices.length > 0) {
        const numbers = devices.map((d) => parseInt(d.name.slice(1)));
        nextNumber = Math.max(...numbers) + 1;
      }

      name = `D${nextNumber}`;
    }
    const device = new Device({ name, type, switch: false, deviceStatus: false });

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


// Update switch (user ON/OFF)
export const updateDeviceSwitch = async (req, res) => {
  try {
    const { switchState } = req.body; // true/false
    const { name } = req.query;

    if (!name) return res.status(400).json({ error: "Device name is required" });
    if (typeof switchState !== "boolean") return res.status(400).json({ error: "Switch must be true or false" });

    const updated = await Device.findOneAndUpdate(
      { name: new RegExp(`^${name}$`, "i") },
      { switch: switchState },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: `Device '${name}' not found` });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update deviceStatus (online/offline) — typically called by IoT backend
export const updateDeviceStatus = async (req, res) => {
  try {
    const { deviceStatus } = req.body; // true/false
    const { name } = req.query;

    if (!name) return res.status(400).json({ error: "Device name is required" });
    if (typeof deviceStatus !== "boolean") return res.status(400).json({ error: "deviceStatus must be true or false" });

    const updated = await Device.findOneAndUpdate(
      { name: new RegExp(`^${name}$`, "i") },
      { deviceStatus },
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

// Update name/type by ID
export const editDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    if (!name && !type) {
      return res.status(400).json({ error: "Name or type must be provided" });
    }

    const updated = await Device.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(type && { type }) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Device not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

