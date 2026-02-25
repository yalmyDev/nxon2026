import React from 'react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

    export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
        alignItems: 'center', zIndex: 2000
        }}>
        <div style={{
            backgroundColor: '#252526', padding: '25px', borderRadius: '8px',
            width: '320px', border: '1px solid #454545', textAlign: 'center'
        }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>로그아웃</h3>
            <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '25px' }}>
            정말 로그아웃 하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={onClose} style={{
                padding: '8px 20px', backgroundColor: '#3c3c3c', color: '#fff',
                border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}>취소</button>
            <button onClick={onConfirm} style={{
                padding: '8px 20px', backgroundColor: '#ef5350', color: '#fff',
                border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
            }}>로그아웃</button>
            </div>
        </div>
        </div>
    );
}