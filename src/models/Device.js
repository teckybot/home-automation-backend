
import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["fan", "light"], required: true },
  status: { type: Boolean, default: false },  // true = online, false = offline
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Device", deviceSchema);
