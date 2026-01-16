import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link'; 
import ImageExtension from '@tiptap/extension-image'; 
import { FiBold, FiItalic, FiCode, FiList, FiMinus, FiLink, FiImage, FiType, FiLoader } from 'react-icons/fi';
import { FaStrikethrough } from 'react-icons/fa';

// --- TOOLBAR COMPONENT ---
const ToolbarButton = ({ onClick, children, isActive, disabled, title }) => (
    <button 
      type="button" 
      onClick={onClick} 
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-lg transition-colors flex items-center justify-center
        ${isActive 
          ? 'bg-indigo-600 text-white' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
        {children}
    </button>
);

const Toolbar = ({ editor, onImageUpload, isUploading }) => {
  if (!editor) return null;

  // Link Logic
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // Image Upload Logic
  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file && onImageUpload) await onImageUpload(file);
    };
    input.click();
  };

  return (
    <div className="p-2 border-b border-slate-200 dark:border-white/10 flex items-center flex-wrap gap-1 bg-slate-50 dark:bg-[#0f172a]/50 sticky top-0 z-10">
      
      {/* Typography */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2"><FiType /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><FiBold /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><FiItalic /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough"><FaStrikethrough /></ToolbarButton>
      
      <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Structure */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block"><FiCode /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><FiList /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line"><FiMinus /></ToolbarButton>

      <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>

     
      <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Add Link"><FiLink /></ToolbarButton>
      <ToolbarButton onClick={handleImageClick} disabled={isUploading} title="Upload Image">
        {isUploading ? <FiLoader className="animate-spin" /> : <FiImage />}
      </ToolbarButton>
    </div>
  );
};

// --- MAIN EDITOR COMPONENT ---
const RichTextEditor = ({ content, onChange, onImageUpload, isUploading }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
            class: 'rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 my-4 max-w-full',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
            class: 'text-indigo-500 hover:underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your documentation...',
      }),
    ],
    content: content, 
    editorProps: {
      attributes: {
        
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-slate-300 dark:prose-strong:text-white p-6 min-h-[300px] focus:outline-none prose-a:text-indigo-500 hover:prose-a:underline text-slate-900 dark:text-gray-100 prose-img:rounded-xl prose-code:text-indigo-500 prose-pre:bg-[#0b1121] prose-pre:border prose-pre:border-white/10',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // --- 🔴 THE FIX FOR LAG / SYNC ISSUES ---
  // This useEffect watches the 'content' prop. 
  // When you select a new note, we forces the editor to update its content immediately.
  useEffect(() => {
    if (editor && content !== undefined) {
       
       const currentHTML = editor.getHTML();
       if (content !== currentHTML) {
        
         editor.commands.setContent(content); 
       }
    }
  }, [content, editor]);

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      <Toolbar editor={editor} onImageUpload={onImageUpload} isUploading={isUploading} />
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1e293b]">
         <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;