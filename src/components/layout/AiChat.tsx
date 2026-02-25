import React, { useState, useEffect, useRef } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

interface AiChatProps {
    onInsert: (code: string) => void;
}

export default function AiChat({ onInsert }: AiChatProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // 로컬스토리지에서 기존 히스토리 불러오기
    useEffect(() => {
        const saved = localStorage.getItem('vibe_chat_sessions');
        if (saved) {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
        }
    }, []);

    // 세션 데이터가 변경될 때마다 로컬스토리지에 저장 및 스크롤 하단 이동
    useEffect(() => {
        if (sessions.length > 0) {
        localStorage.setItem('vibe_chat_sessions', JSON.stringify(sessions));
        }
        if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [sessions]);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    // 새로운 채팅방 생성
    const createNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = { 
        id: newId, 
        title: '새로운 대화', 
        messages: [], 
        timestamp: Date.now() 
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newId);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        let currentSessions = [...sessions];
        let session = currentSessions.find(s => s.id === activeSessionId);

        // 활성화된 세션이 없으면 새로 생성
        if (!session) {
        const newId = Date.now().toString();
        session = { id: newId, title: '새로운 대화', messages: [], timestamp: Date.now() };
        currentSessions = [session, ...currentSessions];
        setActiveSessionId(newId);
        }

        const userMsg: Message = { role: 'user', content: input };
        
        // AI 답변 예시 (줄바꿈 \n을 명확히 포함한 템플릿 리터럴 사용)
        const aiResponse = `// 요청하신 코드 블록입니다.\nfunction solution() {\n  console.log("${input}");\n  return true;\n}`;
        const aiMsg: Message = { role: 'assistant', content: aiResponse };

        // 첫 메시지인 경우 제목 업데이트 (최대 15자)
        if (session.messages.length === 0) {
        session.title = input.length > 15 ? input.substring(0, 15) + '...' : input;
        }

        session.messages.push(userMsg, aiMsg);
        setSessions(currentSessions);
        setInput('');
    };

    // 대화방 삭제 기능 (추가)
    const deleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const filtered = sessions.filter(s => s.id !== id);
        setSessions(filtered);
        if (activeSessionId === id) {
        setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
        }
        if (filtered.length === 0) localStorage.removeItem('vibe_chat_sessions');
    };

    return (
        <div style={{ display: 'flex', height: '100%', backgroundColor: '#1e1e1e', color: '#ccc', overflow: 'hidden' }}>
        {/* 1. 왼쪽: 채팅 히스토리 목록 (제목 리스트) */}
        <div style={{ width: '180px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', backgroundColor: '#252526' }}>
            <button 
            onClick={createNewChat} 
            style={{ margin: '10px', padding: '8px', backgroundColor: '#007acc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
            >
            + 새 채팅 시작
            </button>
            <div style={{ flex: 1, overflowY: 'auto' }}>
            {sessions.map(s => (
                <div 
                key={s.id} 
                onClick={() => setActiveSessionId(s.id)}
                style={{ 
                    padding: '10px 12px', 
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    backgroundColor: activeSessionId === s.id ? '#37373d' : 'transparent', 
                    borderBottom: '1px solid #2b2b2b',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{s.title}</span>
                <span onClick={(e) => deleteSession(s.id, e)} style={{ marginLeft: '5px', opacity: 0.5, fontSize: '10px' }}>✕</span>
                </div>
            ))}
            </div>
        </div>

        {/* 2. 오른쪽: 대화창 및 입력창 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* 메시지 목록 영역 */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!activeSession ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#555' }}>
                <p>기록된 대화가 없습니다.</p>
                <p style={{ fontSize: '12px' }}>AI와 코딩 상담을 시작해 보세요.</p>
                </div>
            ) : (
                activeSession.messages.map((msg, i) => (
                <div key={i} style={{ 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                    maxWidth: '85%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    backgroundColor: msg.role === 'user' ? '#007acc' : '#2d2d2d', 
                    color: '#fff',
                    fontSize: '13px',
                    border: msg.role === 'assistant' ? '1px solid #444' : 'none'
                }}>
                    {/* 줄바꿈 보존을 위해 pre-wrap 사용 */}
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {msg.content}
                    </div>
                    
                    {msg.role === 'assistant' && (
                    <button 
                        onClick={() => onInsert(`\n${msg.content}\n`)} // 삽입 시 앞뒤 줄바꿈 추가
                        style={{ 
                        marginTop: '10px', 
                        padding: '4px 10px', 
                        fontSize: '11px', 
                        backgroundColor: '#3e3e42', 
                        color: '#007acc', 
                        border: '1px solid #007acc', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                        }}
                    >
                        이 코드 삽입하기
                    </button>
                    )}
                </div>
                ))
            )}
            </div>

            {/* 입력창 영역 */}
            <div style={{ padding: '15px', borderTop: '1px solid #333', backgroundColor: '#1e1e1e' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="궁금한 코드를 물어보세요..." 
                style={{ flex: 1, padding: '10px', backgroundColor: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: '4px', outline: 'none' }}
                />
                <button 
                onClick={handleSend} 
                style={{ padding: '0 15px', backgroundColor: '#007acc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                전송
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}