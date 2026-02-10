// src/components/layout/AiChat.tsx
import React, { useState } from 'react';
import { fetchAIResponse } from '../../services/aiService';

interface AiChatProps {
    onInsert: (code: string) => void;
}

    const AiChat = ({ onInsert }: AiChatProps) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const aiResponse = await fetchAIResponse(input);
    setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
    setIsLoading(false);
    };

    // 마크다운 내 코드 블록 추출 정규식
    const extractCode = (text: string) => {
    const match = text.match(/```(?:[a-z]+)?\n([\s\S]*?)\n```/);
    return match ? match[1] : text;
};

    return (
    <div className="ai-chat-container">
        <div className="chat-messages">
        {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
            <div className="content">{msg.content}</div>
            {msg.role === "assistant" && msg.content.includes("```") && (
                <button 
                className="insert-btn" 
                onClick={() => onInsert(extractCode(msg.content))}
                >
                코드 주입하기
                </button>
            )}
            </div>
        ))}
        {isLoading && <div className="message ai">생각 중...</div>}
        </div>
        <div className="chat-input-wrapper">
        <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="어떤 코드를 짜드릴까요?" 
        />
        <button onClick={handleSend} disabled={isLoading}>전송</button>
        </div>
    </div>
    );
};

export default AiChat;