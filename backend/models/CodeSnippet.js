import mongoose from "mongoose";

const CodeSnippetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String, 
    default: "cpp", 
  },
  tags: {
    type: [String], 
    default: [],
  },
  
  // Optional Fields
  timeComplexity: { type: String, default: "" },
  spaceComplexity: { type: String, default: "" },
  problemLink: { type: String, default: "" },
  isFavorite: { type: Boolean, default: false },
}, { timestamps: true });

// 2. CRITICAL DATABASE FIX
// We MUST tell MongoDB: "Do not use the 'language' field for text search logic."
// We point it to a non-existent field "dummy" so it ignores our coding language field.
CodeSnippetSchema.index({ title: 'text', tags: 'text' }, { language_override: "dummy" }); 

const CodeSnippet = mongoose.model("CodeSnippet", CodeSnippetSchema);
export default CodeSnippet;