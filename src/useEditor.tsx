// src/hooks/useEditor.ts
import { useRef } from 'react';

export const useEditor = () => {
    const editorRef = useRef<any>(null);

    // 에디터 마운트 시 호출될 핸들러
    const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    };

    // 특정 텍스트를 커서 위치에 주입하는 함수
    const insertCode = (newCode: string) => {
    if (editorRef.current) {
        const editor = editorRef.current;
        const selection = editor.getSelection();
        
        editor.executeEdits("vibe-ai", [
        {
            range: selection,
            text: newCode,
            forceMoveMarkers: true,
        },
        ]);
        // 주입 후 에디터에 포커스 조절
        editor.focus();
    }
    };

    return { handleEditorDidMount, insertCode };
};