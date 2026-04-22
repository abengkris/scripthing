import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const WordCount = ({ editor }) => {
    const [wordCount, setWordCount] = useState(0);
    useEffect(() => {
        if (!editor)
            return;
        const updateWordCount = () => {
            const text = editor.getText();
            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            setWordCount(words.length);
        };
        editor.on('update', updateWordCount);
        updateWordCount();
        return () => {
            editor.off('update', updateWordCount);
        };
    }, [editor]);
    const pageCount = Math.ceil(wordCount / 250);
    return (_jsxs("div", { className: "text-sm text-gray-500 bg-white px-2 py-1 border-t border-gray-200", children: ["Words: ", wordCount, " | Est. Pages: ", pageCount] }));
};
export default WordCount;
