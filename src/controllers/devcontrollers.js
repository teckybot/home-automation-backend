import Device from "../models/Device.js";

// 1. Get switch status (1/0) for a device
export const getDeviceSwitchStatus = async (req, res) => {
  try {
    const { name } = req.params;

    const device = await Device.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (!device) return res.status(404).json({ error: "Device not found" });

    return res.json({ switch: device.switch ? 1 : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get switch status AND update deviceStatus (activate/deactivate device)
// Store timers globally so we can clear/reset them for each device
const deviceTimers = {};

// 2. Get switch status AND update deviceStatus (activate/deactivate device)

// Add timer store outside controller
const offlineTimers = {};

export const getDeviceStatusAndToggle = async (req, res) => {
  try {
    const { name } = req.params;
    const { deviceStatus } = req.query;

    const device = await Device.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (!device) return res.status(404).json({ error: "Device not found" });

    // Update deviceStatus if passed
    if (deviceStatus !== undefined) {
      const newStatus = deviceStatus === "1";

      if (newStatus) {
        // Mark as online, clear any old timer
        device.deviceStatus = true;
        await device.save();

        if (offlineTimers[name]) clearTimeout(offlineTimers[name]);

        // Auto-set offline after 60s
        offlineTimers[name] = setTimeout(async () => {
          const d = await Device.findOne({ name: new RegExp(`^${name}$`, "i") });
          if (d && d.deviceStatus) {
            d.deviceStatus = false;
            d.lastOnline = new Date(); // Update last online
            await d.save();
            console.log(`Device '${name}' auto-set offline at ${d.lastOnline}`);
          }
        }, 60000);

      } else {
        // Going offline manually → record lastOnline
        device.deviceStatus = false;
        device.lastOnline = new Date();
        await device.save();

        if (offlineTimers[name]) clearTimeout(offlineTimers[name]);
      }
    }

    return res.json({
      switch: device.switch ? 1 : 0,
      deviceStatus: device.deviceStatus ? 1 : 0,
      lastOnline: device.lastOnline || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// 3. Update switch status (1/0) but only if device is online
export const setSwitchIfDeviceOnline = async (req, res) => {
  try {
    const { name, status } = req.query; // 1 or 0

    if (!name) return res.status(400).json({ error: "Device name required" });
    if (status !== "1" && status !== "0")
      return res.status(400).json({ error: "Status must be 1 or 0" });

    const device = await Device.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (!device) return res.status(404).json({ error: "Device not found" });

    // Check if device is online before toggling
    if (!device.deviceStatus) {
      return res.status(400).json({
        error: `Device '${name}' is offline. Cannot change switch.`,
        switch: device.switch ? 1 : 0,
      });
    }

    // Update switch
    device.switch = status === "1";
    await device.save();

    return res.json({
      message: `Switch for '${name}' set to ${device.switch ? 1 : 0}`,
      switch: device.switch ? 1 : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

