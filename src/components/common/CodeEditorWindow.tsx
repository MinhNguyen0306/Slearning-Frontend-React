import { useRef, useState } from "react";

import Editor from "@monaco-editor/react";

type Props = {
    onChange: (action: string, value: any) => void,
    setLineCount: (line: number) => void,
    language: string,
    code: string,
    theme: string,
    defaultValue?: string
}

const CodeEditorWindow = ({ onChange, language, code, theme, setLineCount, defaultValue }: Props) => {
    const customHTMLRef = useRef<any>(null);
    const [value, setValue] = useState<string>(code || "");

    const handleEditorChange = (value: any) => {
        setLineCount(customHTMLRef.current !== null ? customHTMLRef.current.getModel().getLineCount() : 0)
        setValue(value);
        onChange("code", value);
    };

    function handleHTMLEditorDidMount(editor: any) {
        setLineCount(editor.getModel().getLineCount());
        customHTMLRef.current = editor;
    }

    return (
        <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
        <Editor
            height="80vh"
            width={`100%`}
            language={language || "javascript"}
            value={value}
            theme={theme}
            onMount={handleHTMLEditorDidMount}
            defaultValue={defaultValue}
            onChange={handleEditorChange}
        />
        </div>
    );
};
export default CodeEditorWindow;