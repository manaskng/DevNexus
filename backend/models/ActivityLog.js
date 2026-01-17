import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true, 
    index: true 
  },
  user: { type: String, required: true }, 
  action: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// implemented TTL index to auto-delete logs after 24 hours (86400 seconds)
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
export default ActivityLog;