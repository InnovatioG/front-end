import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import styles from './TextEditor.module.scss';
import useTextEditor from '@/components/General/Elements/TextEditor/useTextEditor';
import { useCallback } from 'react';

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

interface TextEditorProps {
    title?: string;
    content?: string;
    onChange: (newContent: string) => void;
    styleOption: string;
    menuOptions?: number;
}

export default function TextEditor({ title, content, onChange, styleOption = 'quillEditor', menuOptions = 0 }: TextEditorProps) {
    const { editorContent, handleEditorChange, quillModules, quillFormats, handleImageUpload, quillRef } = useTextEditor({ content, onChange, menuOptions });

    const modules = {
        ...quillModules,
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ...(menuOptions === 0 ? [['link', 'image', 'video']] : []),
                [{ align: [] }],
            ],
            handlers: {
                image: handleImageUpload,
            },
        },
    };

    const memoizedHandleEditorChange = useCallback(handleEditorChange, [handleEditorChange]);

    return (
        <main className={styles.main}>
            <div style={{ height: '100%', width: '100%' }}>
                <h2 className={styles.title}>{title}</h2>
                <QuillEditor
                    ref={quillRef}
                    theme="snow"
                    value={editorContent}
                    onChange={memoizedHandleEditorChange}
                    placeholder="Insert description"
                    modules={modules}
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