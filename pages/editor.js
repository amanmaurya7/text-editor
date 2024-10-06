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

  // Prism.js ka load karna
  useEffect(() => {
    const loadPrism = async () => {
      const Prism = await import('prismjs');
      await import('prismjs/themes/prism.css'); // Prism ka CSS styling
      await import('prismjs/components/prism-javascript.min.js'); // JavaScript support
      await import('prismjs/components/prism-css.min.js'); // CSS support
      await import('prismjs/components/prism-python.min.js'); // Python support
      // Aur agar aapko aur languages support chahiye, unhe bhi import karein
    };
    loadPrism();
  }, []);

  // Quill custom blot for headings
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

  const highlightCode = (code) => {
    return Prism.highlight(code, Prism.languages.javascript, 'javascript') || 
           Prism.highlight(code, Prism.languages.css, 'css');
  };

  const renderHighlightedContent = () => {
    const codeBlocks = editorContent.split(/```(\w+)?\n([\s\S]*?)\n```/g);
    
    return codeBlocks.map((block, index) => {
      if (index % 3 === 0) {
        return <p key={index}>{block}</p>;
      } else {
        const language = codeBlocks[index - 1];
        const highlighted = highlightCode(block);
        return (
          <pre key={index} className={`language-${language} preformatted`} style={styles.preformatted}>
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        );
      }
    });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
      ['code-block'], // Button to insert code blocks
    ],
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f7f9fc', // Light background
    },
    textEditor: {
      background: 'white', // White background for editor
      borderRadius: '8px', // Rounded corners
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
      padding: '24px',
      width: '100%',
      maxWidth: '800px', // Adjust width as needed
    },
    button: {
      padding: '10px 20px',
      borderRadius: '4px',
      fontWeight: 'bold',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    preformatted: {
      backgroundColor: '#282c34', // Dark background for code
      color: '#abb2bf', // Light text color
      padding: '10px', // Padding inside code block
      borderRadius: '5px', // Rounded corners
      overflowX: 'auto', // Horizontal scroll if needed
      marginTop: '10px', // Spacing above the code block
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.textEditor}>
        <h1 className="text-2xl font-bold mb-4 text-center">Text Editor</h1>
        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          modules={modules}
          className="mb-4 border-2 border-gray-300 rounded"
        />
        <div className="overflow-auto">
          {renderHighlightedContent()}
        </div>
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={saveContent} 
            style={{ ...styles.button, backgroundColor: '#3b82f6' }} // Blue
          >
            Save Content
          </button>
          <button 
            onClick={downloadWord} 
            style={{ ...styles.button, backgroundColor: '#22c55e' }} // Green
          >
            Download as Word
          </button>
          <button 
            onClick={downloadPDF} 
            style={{ ...styles.button, backgroundColor: '#ef4444' }} // Red
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
