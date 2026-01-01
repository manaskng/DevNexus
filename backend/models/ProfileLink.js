import mongoose from "mongoose";

const ProfileLinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platform: {
    type: String, 
    required: true,
  },
  username: {
    type: String, 
    required: true,
  },
  url: {
    type: String, 
    required: true,
  },
  category: {
    type: String,
    enum: ["Coding", "Professional", "Social", "Projects", "Other"],
    default: "Other",
  },
  description: {
    type: String, 
    trim: true,
    default: "",
  },
  badgeUrl: {
    type: String, 
    default: "", 
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const ProfileLink = mongoose.model("ProfileLink", ProfileLinkSchema);
export default ProfileLink;