import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Editor = () => {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      setEditorContent(savedContent);
    }
  }, []);

  useEffect(() => {
    const Quill = require('quill'); // Dynamic import of Quill
    const Block = Quill.import('blots/block');

    class HeadingBlot extends Block {
      static create(value) {
        const node = super.create();
        node.setAttribute('data-heading', value);
        return node;
      }

      static formats(node) {
        return node.getAttribute('data-heading');
      }
    }

    HeadingBlot.blotName = 'heading';
    HeadingBlot.tagName = 'h1 h2';

    Quill.register(HeadingBlot);
  }, []); // Ye effect sirf ek baar chalega jab component mount hoga

  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  const saveContent = () => {
    localStorage.setItem('editorContent', editorContent);
    alert('Content saved!');
  };

  const downloadWord = () => {
    const blob = new Blob([editorContent], {
      type: 'application/msword',
    });
    saveAs(blob, 'document.doc');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(editorContent, 10, 10);
    doc.save('document.pdf');
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }], // h1, h2, and normal text
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Text Editor</h1>
        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          modules={modules}
          className="mb-4 border-2 border-gray-300 rounded"
        />
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={saveContent} 
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Content
          </button>
          <button 
            onClick={downloadWord} 
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
          >
            Download as Word
          </button>
          <button 
            onClick={downloadPDF} 
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600"
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
