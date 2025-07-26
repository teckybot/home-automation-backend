import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  switch: { type: Boolean, default: false },        // ON/OFF controlled by user
  deviceStatus: { type: Boolean, default: false },    // Online/Offline (IoT status)
  lastOnline: { type: Date, default: null },
  mode: { type: String, enum: ["controller", "monitoring"], default: "controller" },
  sensorValue: { type: Number, default: null } // For monitoring devices  
});

export default mongoose.model("Device", deviceSchema);
