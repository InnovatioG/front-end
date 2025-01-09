import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import { useEffect, useState } from 'react';
import styles from './TextEditor.module.scss';

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

interface TextEditorProps {
    title?: string;
    content: string;
    onChange: (newContent: string) => void;
    styleOption: string;
    menuOptions?: number;
}

export default function TextEditor({ title, content, onChange, styleOption = 'quillEditor', menuOptions = 0 }: TextEditorProps) {
    const [editorContent, setEditorContent] = useState(content);

    useEffect(() => {
        if (content !== '<p><br></p>') {
            setEditorContent(content);
        }
    }, [content]);

    const handleEditorChange = (newContent: string) => {
        if (newContent !== '<p><br></p>') {
            setEditorContent(newContent);
            onChange(newContent);
        }
    };
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ...(menuOptions === 0 ? [['link', 'image', 'video']] : []),
            [{ align: [] }],
        ],
    };

    const quillFormats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', ...(menuOptions === 0 ? ['link', 'image', 'video'] : []), 'align'];

    return (
        <main className={styles.main}>
            <div style={{ height: '100%', width: '100%' }}>
                <h2 className={styles.title}>{title}</h2>
                <QuillEditor
                    value={editorContent}
                    onChange={handleEditorChange}
                    placeholder="Insert description"
                    modules={quillModules}
                    formats={quillFormats}
                    className={styles[styleOption]}
                />
            </div>
            <style jsx global>{`
                .ql-toolbar.ql-snow {
                    border: 1px solid #e9e9e9;
                    background-color: #f9f9f9;
                    border-radius: 0.75rem;
                    padding: 0.5rem;
                }
                ,
                .ql-editor {
                    background-color: blue;
                }

                ,
                .ql-container.ql-snow {
                    border: 1px solid red;
                    background-color: red !important;
                }
                .ql-container.ql-snow {
                    border-radius: 0.75rem;
                    background-color: #f9f9f9;
                    padding: 1rem;
                    border: 1px solid #e9e9e9;

                    border-top: 1px solid #e9e9e9;
                }
                .ql-editor {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    color: #333;
                }
                .ql-container.ql-snow {
                    border-radius: 0.75rem;
                    background-color: #f9f9f9;
                    padding: 1rem;
                    border: 1px solid #e9e9e9;
                    border-top: 1px solid #e9e9e9;
                    min-height: 300px;
                }
                .ql-editor {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    color: #333;
                }
                .ql-toolbar.ql-snow + .ql-container.ql-snow {
                    border-top: 1px solid #e9e9e9;
                }
                .ql-editor.ql-blank::before {
                    padding: 0rem 1rem;
                    color: #999;
                }
            `}</style>
        </main>
    );
}
