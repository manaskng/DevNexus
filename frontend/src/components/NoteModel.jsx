import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  FiSave, FiClock, FiImage, FiLink, FiBold, FiItalic, 
  FiCode, FiList, FiType, FiLoader, FiAlignLeft, FiAlignCenter, FiAlignRight, FiX 
} from "react-icons/fi";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

// --- PROFESSIONAL TOOLBAR COMPONENT ---
const MenuBar = ({ editor, onImageUpload, isUploading }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) await onImageUpload(file);
    };
    input.click();
  };

  const btnClass = (isActive) => 
    `p-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`;

  return (
    <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3 sticky top-0 bg-white dark:bg-[#0f172a] z-10">
      
      {/* Text Styling */}
      <div className="flex gap-1 pr-3 border-r border-slate-200 dark:border-slate-800 mr-2">
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Heading">
            <FiType size={18} />
        </button>
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold">
            <FiBold size={18} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic">
            <FiItalic size={18} />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 pr-3 border-r border-slate-200 dark:border-slate-800 mr-2">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align Left">
            <FiAlignLeft size={18} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align Center">
            <FiAlignCenter size={18} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align Right">
            <FiAlignRight size={18} />
        </button>
      </div>

      {/* Structure */}
      <div className="flex gap-1 pr-3 border-r border-slate-200 dark:border-slate-800 mr-2">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet List">
            <FiList size={18} />
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive('codeBlock'))} title="Code Block">
            <FiCode size={18} />
        </button>
      </div>

      {/* Rich Media */}
      <div className="flex gap-1">
        <button onClick={setLink} className={btnClass(editor.isActive('link'))} title="Add Link">
            <FiLink size={18} />
        </button>
        <button onClick={handleImageClick} className={btnClass(false)} title="Upload Image" disabled={isUploading}>
            {isUploading ? <FiLoader className="animate-spin" size={18}/> : <FiImage size={18} />}
        </button>
      </div>
    </div>
  );
};

// --- MAIN DOC EDITOR COMPONENT ---
const NoteModel = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit, // Contains core nodes (bold, italic, code, etc)
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 my-6 max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-500 hover:underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Placeholder.configure({
        placeholder: 'Start documenting technical specs, architecture decisions, or meeting notes...',
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[400px] prose-p:leading-relaxed prose-headings:font-bold prose-code:text-indigo-500 prose-pre:bg-slate-900 prose-pre:text-slate-100",
      },
    },
  });

  // Sync state when opening an existing note
  useEffect(() => {
    if (note && editor) {
      setTitle(note.title);
      editor.commands.setContent(note.description);
    } else if (editor && !note) {
      setTitle("");
      editor.commands.setContent("");
    }
  }, [note, isOpen, editor]);

  // UPLOAD HANDLER (Uses your backend /api/upload)
  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
        }
      });
      
      const imageUrl = res.data.url;
      // Insert image at current cursor position
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image. Check server logs.");
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  // SAVE HANDLER (Performs API call here to get the _id back)
  const handleSubmit = async () => {
    if (!title.trim()) return alert("Document title is required.");
    setIsSaving(true);

    const noteData = { 
      title, 
      description: editor.getHTML() 
    };

    try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;
        let savedData;

        if (note && note._id) {
            // UPDATE existing
            const res = await axios.put(`${API_URL}/api/notes/${note._id}`, noteData, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            savedData = res.data;
        } else {
            // CREATE new
            const res = await axios.post(`${API_URL}/api/notes`, noteData, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            savedData = res.data;
        }

        // Send full object back to List (fixes 'undefined' ID bug)
        onSave(savedData); 
        onClose();
    } catch (error) {
        console.error("Save failed", error);
        alert("Failed to save document. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Modal Container */}
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#0f172a]">
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
               {note ? "Editing Document" : "Drafting New Doc"}
             </span>
             <div className="flex items-center gap-2 text-xs text-slate-500">
               <FiClock /> <span>{note ? "Synced" : "Unsaved Changes"}</span>
             </div>
          </div>
          <div className="flex gap-3">
            <button 
                onClick={onClose} 
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button 
                onClick={handleSubmit} 
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <FiLoader className="animate-spin"/> : <FiSave />} 
              {isSaving ? "Saving..." : "Save Doc"}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:px-20 bg-white dark:bg-[#0f172a]">
          <div className="max-w-3xl mx-auto">
            {/* Title Input */}
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Document"
              className="w-full text-4xl md:text-5xl font-black text-slate-900 dark:text-white bg-transparent border-none outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 mb-8 leading-tight"
              autoFocus
            />

            {/* Toolbar & Editor */}
            <MenuBar editor={editor} onImageUpload={handleImageUpload} isUploading={isUploading} />
            <div className="mt-2 min-h-[500px]">
                <EditorContent editor={editor} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NoteModel;