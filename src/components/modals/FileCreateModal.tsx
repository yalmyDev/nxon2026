import React, { useState } from 'react';

interface FileCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (fileName: string) => void;
}

const FileCreateModal = ({ isOpen, onClose, onCreate }: FileCreateModalProps) => {
const [fileName, setFileName] = useState('');

if (!isOpen) return null;

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim()) {
        onCreate(fileName);
        setFileName('');
        onClose();
    }
};

return (
    <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    }}>
        <div style={{
        backgroundColor: '#252526',
        padding: '20px',
        borderRadius: '5px',
        width: '300px',
        border: '1px solid #454545',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        color: '#cccccc'
        }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>새 파일 생성</h3>
        <form onSubmit={handleSubmit}>
            <input
            autoFocus
            type="text"
            placeholder="예: index.ts"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{
                width: '100%',
                padding: '8px',
                marginBottom: '15px',
                backgroundColor: '#3c3c3c',
                border: '1px solid #007acc',
                color: 'white',
                outline: 'none'
            }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
                type="button"
                onClick={onClose}
                style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #454545',
                color: '#cccccc',
                cursor: 'pointer'
                }}
            >
                취소
            </button>
            <button
                type="submit"
                style={{
                padding: '6px 12px',
                backgroundColor: '#007acc',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
                }}
            >
                생성
            </button>
            </div>
        </form>
        </div>
    </div>
    );
};

export default FileCreateModal;