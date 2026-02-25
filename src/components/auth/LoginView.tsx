import React, { useState } from 'react';

export default function LoginView({ onLogin }: { onLogin: (empId: string) => void }) {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (empId && password === '1234') { // 비번 임시 1234
        onLogin(empId);
        } else {
        alert('정보가 일치하지 않습니다. (힌트: 사번 아무거나 / 비번 1234)');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e', color: 'white' }}>
        <div style={{ padding: '40px', backgroundColor: '#252526', borderRadius: '8px', width: '300px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: '#007acc', marginBottom: '20px' }}>VIBE LOGIN</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="사번" value={empId} onChange={(e) => setEmpId(e.target.value)}
                style={{ padding: '10px', backgroundColor: '#3c3c3c', border: '1px solid #555', color: 'white', borderRadius: '4px' }} />
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px', backgroundColor: '#3c3c3c', border: '1px solid #555', color: 'white', borderRadius: '4px' }} />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>로그인</button>
            </form>
        </div>
        </div>
    );
}