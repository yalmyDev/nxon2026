import React from 'react';

export default function AiModuleSelector() {
    const modules = [
    { id: 'llama3', name: 'Llama 3 (Local)', description: 'Fast local inference' },
    { id: 'gpt4', name: 'GPT-4o (API)', description: 'Advanced cloud model' },
    { id: 'claude3', name: 'Claude 3.5 Sonnet', description: 'Great for coding' },
    ];

    return (
    <div className="panel-sidebar">
        <div className="sidebar-header">AI MODULES</div>
        <div className="ai-module-list" style={{ padding: '10px' }}>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
            Select the model to use for code assistance.
        </p>
        {modules.map((m) => (
            <div key={m.id} className="module-item" style={{ marginBottom: '12px', cursor: 'pointer' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="radio" name="ai-module" defaultChecked={m.id === 'llama3'} />
                <div>
                <div style={{ color: '#eee', fontSize: '14px' }}>{m.name}</div>
                <div style={{ color: '#666', fontSize: '11px' }}>{m.description}</div>
                </div>
            </label>
            </div>
        ))}
        </div>
    </div>
    );
}