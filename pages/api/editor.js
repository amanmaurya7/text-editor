// pages/editor.js
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';

// Import Quill dynamically because it doesn't work with SSR (Server-Side Rendering)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Editor = () => {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Text Editor</h1>
      <ReactQuill value={editorContent} onChange={handleEditorChange} />
    </div>
  );
};

export default Editor;
