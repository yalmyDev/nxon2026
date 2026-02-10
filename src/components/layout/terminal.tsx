import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const bufferRef = useRef(''); // 순수 입력값 저장소

    // 문자열 너비 계산 (한글=2, 영문=1)
    const getCharWidth = (char: string) => {
    // eslint-disable-next-line no-control-regex
    return /[^\u0000-\u00ff]/.test(char) ? 2 : 1;
    };

    useEffect(() => {
    if (!terminalRef.current) return;

    // 1. 터미널 생성
    const term = new Terminal({
        theme: { background: '#1e1e1e', foreground: '#cccccc' },
        cursorBlink: true,
        fontFamily: 'monospace',
        fontSize: 14,
        convertEol: true, 
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    const prompt = '$ ';
    term.write(prompt);

    // 2. 입력 핸들러
    const disposable = term.onData((data) => {
        const { cursorX } = term.buffer.active; 
        const { cols } = term; 

        // [엔터]
        if (data === '\r') {
        term.write('\r\n' + prompt);
        bufferRef.current = '';
        } 
        // [백스페이스]
        else if (data === '\u007f' || data === '\b') {
        // [핵심 1] 버퍼가 비었으면 절대 실행 안 함 (프롬프트 $ 보호)
        if (bufferRef.current.length === 0) {
            return; 
        }

        // 지울 글자 정보 파악
        const charToDelete = bufferRef.current.slice(-1);
        const charWidth = getCharWidth(charToDelete);
        
        // 버퍼에서 삭제
        bufferRef.current = bufferRef.current.slice(0, -1);

        // [상황 A] 커서가 왼쪽 벽(0)에 붙어있을 때 (줄바꿈 삭제)
        if (cursorX === 0) {
            // 1. 윗줄로 이동 (\x1b[A)
            // 2. 줄의 맨 끝으로 이동 (\x1b[<cols>G)
            term.write(`\x1b[A\x1b[${cols}G`);
            
            // 3. 한글이면 1칸 더 왼쪽으로 이동 (총 2칸 공간 확보)
            if (charWidth === 2) {
                term.write('\b'); 
            }

            // 4. [핵심 2] \x1b[X : 현재 위치의 글자 삭제 (공백 덮어쓰기 아님!)
            // X 뒤의 숫자는 지울 칸 수 (1 or 2)
            term.write(`\x1b[${charWidth}X`);
        } 
        // [상황 B] 줄 중간에서 삭제
        else {
            // 1. 커서를 뒤로 이동
            term.write('\b');
            if (charWidth === 2) term.write('\b');

            // 2. 해당 위치 글자 소멸 (\x1b[X)
            term.write(`\x1b[${charWidth}X`);
        }
        } 
        // [일반 입력]
        else {
        if (data >= ' ') {
            bufferRef.current += data;
            term.write(data);
        }
        }
    });

    const ro = new ResizeObserver(() => {
        if (terminalRef.current?.offsetWidth) {
        try { fitAddon.fit(); } catch (e) {}
        }
    });
    ro.observe(terminalRef.current);

    return () => {
        disposable.dispose();
        ro.disconnect();
        term.dispose();
    };
    }, []);

    return <div ref={terminalRef} style={{ height: '100%', width: '100%', backgroundColor: '#1e1e1e' }} />;
};

export default TerminalComponent;