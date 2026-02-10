import { useState } from 'react';
import * as Resizable from 'react-resizable-panels';

// ----------------------------------------------------------------------
// 1. 컴포넌트 임포트
// ----------------------------------------------------------------------
import MenuBar from './components/layout/MenuBar';
import SideBar from './components/layout/sidebar';
import EditorArea from './components/layout/editorArea';
import BottomPanel from './components/layout/bottomPanel';
import AiChat from './components/layout/AiChat';
// 개별 요소
import FileCreateModal from './components/modals/FileCreateModal'; 
// ★ 탭바 컴포넌트 추가
import TabBar, { type TabFile } from './components/layout/TabBar';

import { useEditor } from './useEditor'; 
import './components/ui/App.css';

export default function App() {
  // ----------------------------------------------------------------------
  // 2. 상태(State) 선언 (다중 탭 지원으로 변경)
  // ----------------------------------------------------------------------
  // 열린 파일 목록
  const [files, setFiles] = useState<TabFile[]>([]); 
  // 현재 보고 있는 파일의 ID (이름)
  const [activeFileId, setActiveFileId] = useState<string | null>(null); 
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const { handleEditorDidMount, insertCode } = useEditor();

  // ★ 현재 활성화된 파일 정보 계산 (없으면 빈 상태 보여줌)
  const activeFile = files.find(f => f.id === activeFileId) || { 
    id: 'welcome',
    name: 'Welcome', 
    language: 'plaintext', 
    content: '// 파일을 선택하거나 새로 만드세요.' 
  };

  // ----------------------------------------------------------------------
  // 3. 탭 관리 로직 (열기, 닫기, 업데이트)
  // ----------------------------------------------------------------------

  // [공통 함수] 파일 열기 (탭 추가 및 이동)
  const openFile = (name: string, language: string, content: string) => {
    // 1. 이미 열려있는지 확인
    const existingFile = files.find(f => f.id === name);
    
    if (existingFile) {
      // 2. 있으면 그 탭으로 이동
      setActiveFileId(existingFile.id);
    } else {
      // 3. 없으면 배열에 추가하고 이동
      const newFile: TabFile = { id: name, name, language, content };
      setFiles([...files, newFile]);
      setActiveFileId(name);
    }
  };

  // [공통 함수] 탭 닫기
  const closeFile = (id: string) => {
    // 닫으려는 파일을 제외한 목록 생성
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);

    // 만약 닫은 파일이 '현재 보고 있던 파일'이라면?
    if (activeFileId === id) {
      if (newFiles.length > 0) {
        // 남은 파일 중 마지막 파일로 이동
        setActiveFileId(newFiles[newFiles.length - 1].id);
      } else {
        // 다 닫았으면 null
        setActiveFileId(null);
      }
    }
  };

  // ----------------------------------------------------------------------
  // 4. 핸들러 함수 구현
  // ----------------------------------------------------------------------
  
  // [기능 1] 사이드바에서 파일 선택 시 -> 탭 열기
  const handleFileSelect = (content: string, lang: string, name: string) => {
    openFile(name, lang, content);
  };

  // [기능 2] 새 파일 생성 -> 탭 열기
  const handleCreateFile = (newFileName: string) => {
    let lang = 'typescript';
    if (newFileName.endsWith('.html')) lang = 'html';
    else if (newFileName.endsWith('.css')) lang = 'css';
    else if (newFileName.endsWith('.js')) lang = 'javascript';
    else if (newFileName.endsWith('.py')) lang = 'python';

    openFile(newFileName, lang, ""); // 빈 내용으로 열기
  };

  // [기능 3] 파일 열기 (시스템 탐색기) -> 탭 열기
  const handleOpenFile = async () => {
    try {
      // @ts-ignore
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const text = await file.text();
      openFile(file.name, 'typescript', text); 
      console.log('파일 열기 성공:', file.name);
    } catch (err) {
      console.log('파일 열기 취소됨');
    }
  };

  // [기능 4] 폴더 열기 (시스템 탐색기)
  const handleOpenFolder = async () => {
    try {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker();
      alert(`폴더가 선택되었습니다: ${dirHandle.name}`);
    } catch (err) {
      console.log('폴더 열기 취소됨');
    }
  };

  // ----------------------------------------------------------------------
  // 5. 화면 렌더링
  // ----------------------------------------------------------------------
  return (
    <div className="side-container">
      {/* (1) 메뉴바 */}
      <MenuBar 
        onNewFile={() => setIsModalOpen(true)}
        onOpenFile={handleOpenFile} 
        onOpenFolder={handleOpenFolder} 
      />

      {/* (2) 모달창 */}
      <FileCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFile}
      />

      <div className="main-viewport">
        {/* (3) 사이드바 아이콘 (Activity Bar) - 보내주신 SVG 유지 */}
        <aside className="sidemenu-bar">
          <div className="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 9C4 7.11438 4 6.17157 4.58579 5.58579C5.17157 5 6.11438 5 8 5H8.34315C9.16065 5 9.5694 5 9.93694 5.15224C10.3045 5.30448 10.5935 5.59351 11.1716 6.17157L11.8284 6.82843C12.4065 7.40649 12.6955 7.69552 13.0631 7.84776C13.4306 8 13.8394 8 14.6569 8H16C17.8856 8 18.8284 8 19.4142 8.58579C20 9.17157 20 10.1144 20 12V15C20 16.8856 20 17.8284 19.4142 18.4142C18.8284 19 17.8856 19 16 19H8C6.11438 19 5.17157 19 4.58579 18.4142C4 17.8284 4 16.8856 4 15V9Z" stroke="#fff" strokeWidth="2"/>
            </svg>
          </div>
          <div className="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
              <path d="M20 20L17 17" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="1" fill="#fff"/>
              <path d="M12 2.5C13.0892 2.5 14.2097 3.39607 15.0879 5.15234C15.9512 6.87893 16.5 9.29937 16.5 12C16.5 14.7006 15.9512 17.1211 15.0879 18.8477C14.2097 20.6039 13.0892 21.5 12 21.5C10.9108 21.5 9.79033 20.6039 8.91211 18.8477C8.04882 17.1211 7.5 14.7006 7.5 12C7.5 9.29937 8.04882 6.87893 8.91211 5.15234C9.79033 3.39607 10.9108 2.5 12 2.5Z" stroke="#fff"/>
              <path d="M20.2273 7.24987C20.7719 8.19317 20.5561 9.61153 19.4742 11.2502C18.4106 12.8612 16.5888 14.5467 14.25 15.897C11.9112 17.2473 9.54064 17.9822 7.61373 18.0979C5.65364 18.2155 4.3174 17.6932 3.77278 16.7499C3.22817 15.8066 3.44397 14.3882 4.52583 12.7495C5.58945 11.1386 7.41121 9.45307 9.75002 8.10275C12.0888 6.75244 14.4594 6.01751 16.3863 5.90185C18.3464 5.78427 19.6827 6.30656 20.2273 7.24987Z" stroke="#fff"/>
              <path d="M20.2273 16.75C20.7719 15.8067 20.5561 14.3883 19.4742 12.7496C18.4106 11.1387 16.5888 9.45315 14.25 8.10284C11.9112 6.75252 9.54064 6.01759 7.61373 5.90193C5.65364 5.78436 4.3174 6.30665 3.77278 7.24995C3.22817 8.19325 3.44397 9.61162 4.52583 11.2503C5.58945 12.8612 7.41121 14.5467 9.75002 15.8971C12.0888 17.2474 14.4594 17.9823 16.3863 18.098C18.3464 18.2155 19.6827 17.6933 20.2273 16.75Z" stroke="#fff"/>
            </svg>
          </div>
        </aside>

        <Resizable.PanelGroup direction="horizontal">
          {/* 왼쪽 탐색기 패널 */}
          <Resizable.Panel defaultSize={15} minSize={10}>
            <SideBar onFileSelect={handleFileSelect} />
          </Resizable.Panel>

          <Resizable.PanelResizeHandle className="resize-handle-vertical" />

          {/* 중앙 에디터 영역 */}
          <Resizable.Panel defaultSize={55}>
            <Resizable.PanelGroup direction="vertical">
              <Resizable.Panel defaultSize={70}>
                
                {/* [변경] 기존 단일 파일 이름 div를 삭제하고 TabBar를 넣었습니다 */}
                <TabBar 
                  files={files} 
                  activeId={activeFileId} 
                  onSelect={setActiveFileId} 
                  onClose={closeFile} 
                />

                {/* 에디터 높이 계산: TabBar(35px) 만큼 뺌 */}
                <div style={{ height: 'calc(100% - 35px)' }}>
                  <EditorArea 
                    language={activeFile.language} 
                    code={activeFile.content} 
                    onMount={handleEditorDidMount} 
                  />
                </div>
              </Resizable.Panel>
              
              <Resizable.PanelResizeHandle className="resize-handle-horizontal" />
              
              <Resizable.Panel defaultSize={30}>
                <BottomPanel />
              </Resizable.Panel>
            </Resizable.PanelGroup>
          </Resizable.Panel>

          <Resizable.PanelResizeHandle className="resize-handle-vertical" />

          {/* 오른쪽 AI 패널 */}
          <Resizable.Panel defaultSize={30} minSize={20} className="panel-ai">
            <div className="sidebar-header">VIBE AI</div>
            <AiChat onInsert={insertCode} />
          </Resizable.Panel>
        </Resizable.PanelGroup>
      </div>

      <footer className="status-bar">
        <span>Ready</span>
        {/* Footer도 현재 활성 파일을 기준으로 표시 */}
        <span>{activeFile.name}</span>
        <span>UTF-8 | {activeFile.language.toUpperCase()}</span>
      </footer>
    </div>
  );
}