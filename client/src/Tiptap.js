import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: `
      <h2>Hello World,</h2>
      <p>This is a Demo Use of The Editor</p>
      <p><br></p>
      <p>Try Your Self <u>like_UnderLine</u></p>
      <p>or <s>Strike</s></p>
      <p><strong>Bold is Gold</strong></p>
      <p><em>Rale is Elite</em></p>
      <p>Or You Want To <mark>Highlight</mark></p>
      <p>Did I told You About Justify</p>
      <p style="text-align: right">right    or even <span style="text-align: center">center</span></p>
      <p>try The <a href="https://github.com">Link & visit My GitHub</a></p>
      <p style="text-align: left">Left</p>
    `,
  });

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editor-container">
      {/* Barra de herramientas */}
      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
        >
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
        >
          Right
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter the URL');
            editor.chain().focus().setLink({ href: url }).run();
          }}
          className={editor.isActive('link') ? 'active' : ''}
        >
          Link
        </button>
      </div>

      {/* Área de edición */}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

export default Editor;