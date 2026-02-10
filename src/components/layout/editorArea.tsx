import Editor from '@monaco-editor/react';

export default function EditorArea({ language, code, onMount }: any) {
  return (
    <div className="panel-editor" style={{ height: '100%' }}>
      <Editor
        height="100%"
        language={language}
        value={code}
        theme="vs-dark"
        onMount={onMount}
        options={{ automaticLayout: true, fontSize: 14 }}
      />
    </div>
  );
}