// src/services/aiService.ts
const API_URL = "http://your-internal-ai-server:8000/v1/chat/completions"; // 사내 API 주소로 변경
const API_KEY = "your-api-key"; // 필요한 경우

export const fetchAIResponse = async (userMessage: string) => {
    try {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
        model: "your-model-name", // 사용 중인 모델명
        messages: [
            { role: "system", content: "당신은 유능한 소프트웨어 엔지니어입니다. 코드 제안 시 마크다운 형식을 사용하세요." },
            { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        }),
    });

    if (!response.ok) throw new Error("AI 서버 응답 에러");
    const data = await response.json();
    return data.choices[0].message.content;
    } catch (error) {
    console.error("AI 호출 실패:", error);
    return "죄송합니다. AI 서버와 통신 중 오류가 발생했습니다.";
    }
};