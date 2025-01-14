import { useEffect, useState } from 'react';

interface useTextEditor {
    content?: string;
    onChange: (newContent: string) => void;
    menuOptions?: number;
}

export default function useTextEditor({ content, onChange, menuOptions }: useTextEditor) {
    const [editorContent, setEditorContent] = useState(content);

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
    };
}
