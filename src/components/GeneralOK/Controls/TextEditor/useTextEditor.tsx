import { apiUploadFileToS3 } from '@/utils/s3/frontend/s3-frontend-utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

interface useTextEditorProps {
    content?: string;
    onChange: (newContent: string) => void;
    menuOptions?: number;
}

export default function useTextEditor({ content, onChange, menuOptions }: useTextEditorProps) {
    const [editorContent, setEditorContent] = useState(content);
    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        if (content !== '<p><br></p>') {
            setEditorContent(content);
        }
    }, [content]);

    const handleEditorChange = useCallback(
        (newContent: string) => {
            console.log(newContent);
            setEditorContent(newContent);
            onChange(newContent);
        },
        [onChange]
    );

    const handleImageUpload = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                try {
                    const bucketName = 'innovatio.space/innovatioFounderMVP';
                    const key = `quill/${file.name}`;
                    const fileUrl = await apiUploadFileToS3(file, bucketName, key);
                    setEditorContent((prevContent) => `${prevContent}<img src="${fileUrl}" />`);
                    if (!quillRef.current) return;
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, 'image', fileUrl);
                        quill.setSelection(range.index + 1);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        };
    }, []);

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

    return {
        editorContent,
        setEditorContent,
        handleEditorChange,
        quillModules,
        handleImageUpload,
        quillFormats,
        quillRef,
    };
}
/* 

import { useEffect, useState, useRef } from 'react';
import { uploadFileToS3 } from '@/utils/s3Upload';
import ReactQuill from 'react-quill';

interface useTextEditorProps {
    content?: string;
    onChange: (newContent: string) => void;
    menuOptions?: number;
}

export default function useTextEditor({ content, onChange, menuOptions }: useTextEditorProps) {
    const [editorContent, setEditorContent] = useState(content);
    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        if (content !== '<p><br></p>') {
            setEditorContent(content);
        }
    }, [content]);

    const handleEditorChange = (newContent: string) => {
        console.log(newContent);
        setEditorContent(newContent);
        onChange(newContent);
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                try {
                    const bucketName = 'innovatio.space/innovatioFounderMVP';
                    const key = `quill/${file.name}`;
                    const fileUrl = await uploadFileToS3(file, bucketName, key);
                    if (!quillRef.current) return;
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, 'image', fileUrl);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        };
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

    return {
        editorContent,
        setEditorContent,
        handleEditorChange,
        quillModules,
        quillFormats,
        handleImageUpload,
        quillRef,
    };
}

*/
