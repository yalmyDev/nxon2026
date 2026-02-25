import React, { useState } from 'react';
import * as Resizable from 'react-resizable-panels';

import MenuBar from './components/layout/MenuBar';
import ActivityBar from './components/layout/ActivityBar';
import SideBar from './components/layout/SideBar';
import SearchPanel from './components/layout/SearchPanel';
import AiModuleSelector from './components/layout/AiModuleSelector';
import EditorArea from './components/layout/editorArea';
import BottomPanel from './components/layout/bottomPanel';
import AiChat from './components/layout/AiChat';
import TabBar, { type TabFile } from './components/layout/TabBar';
import FileCreateModal from './components/modals/FileCreateModal'; 
import LogoutModal from './components/modals/LogoutModal'; // 모달 추가
import LoginView from './components/auth/LoginView';
import { useEditor } from './useEditor'; 
import './components/ui/App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ empId: '', name: '사용자' });
  const [files, setFiles] = useState<TabFile[]>([]); 
  const [activeFileId, setActiveFileId] = useState<string | null>(null); 
  const [activeMenu, setActiveMenu] = useState('explorer'); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // 로그아웃 모달 상태 추가

  const { handleEditorDidMount, insertCode } = useEditor();

  const handleLogin = (id: string) => { setUserInfo({ ...userInfo, empId: id }); setIsLoggedIn(true); };
  
  // 진짜 로그아웃 처리
  const handleConfirmLogout = () => { 
    setIsLogoutModalOpen(false);
    setIsLoggedIn(false); 
    setFiles([]); 
    setActiveFileId(null); 
  };

  if (!isLoggedIn) return <LoginView onLogin={handleLogin} />;

  const activeFile = files.find(f => f.id === activeFileId) || { id: 'welcome', name: 'Welcome', language: 'plaintext', content: '// 파일을 선택해 주세요.' };

  const handleFileSelect = (content: string, lang: string, name: string) => {
    if (!files.find(f => f.id === name)) setFiles([...files, { id: name, name, language: lang, content }]);
    setActiveFileId(name);
  };

  return (
    <div className="side-container">
      {/* MenuBar에 로그아웃 모달 여는 함수 전달 */}
      <MenuBar 
        onNewFile={() => setIsModalOpen(true)} 
        onOpenFile={() => {}} 
        onOpenFolder={() => {}} 
        userInfo={userInfo} 
        openLogoutModal={() => setIsLogoutModalOpen(true)} 
      />

      <FileCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={(n) => handleFileSelect("", "typescript", n)} 
      />

      {/* 로그아웃 확인 모달 */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />

      <div className="main-viewport" style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        <ActivityBar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <Resizable.PanelGroup direction="horizontal">
          <Resizable.Panel defaultSize={20} minSize={10}>
            {activeMenu === 'explorer' && <SideBar onFileSelect={handleFileSelect} />}
            {activeMenu === 'search' && <SearchPanel />}
            {activeMenu === 'ai-config' && <AiModuleSelector />}
          </Resizable.Panel>
          <Resizable.PanelResizeHandle className="resize-handle-vertical" />
          <Resizable.Panel defaultSize={50}>
            <Resizable.PanelGroup direction="vertical">
              <Resizable.Panel defaultSize={70}>
                <TabBar files={files} activeId={activeFileId} onSelect={setActiveFileId} onClose={(id) => setFiles(files.filter(f => f.id !== id))} />
                <div style={{ height: 'calc(100% - 35px)' }}><EditorArea language={activeFile.language} code={activeFile.content} onMount={handleEditorDidMount} /></div>
              </Resizable.Panel>
              <Resizable.PanelResizeHandle className="resize-handle-horizontal" /><Resizable.Panel defaultSize={30}><BottomPanel /></Resizable.Panel>
            </Resizable.PanelGroup>
          </Resizable.Panel>
          <Resizable.PanelResizeHandle className="resize-handle-vertical" /><Resizable.Panel defaultSize={30} className="panel-ai"><div className="sidebar-header">VIBE AI</div><AiChat onInsert={insertCode} /></Resizable.Panel>
        </Resizable.PanelGroup>
      </div>
    </div>
  );
}