import React from 'react';

// 탭 하나에 대한 정보 타입
export interface TabFile {
  id: string;      // 유니크 ID (보통 파일 경로/이름)
  name: string;    // 화면에 보일 이름
  language: string;
  content: string;
}

interface TabBarProps {
  files: TabFile[];                 // 열린 파일 목록
  activeId: string | null;          // 현재 보고 있는 파일 ID
  onSelect: (id: string) => void;   // 탭 클릭 시
  onClose: (id: string) => void;    // 닫기 버튼 클릭 시
}

const TabBar = ({ files, activeId, onSelect, onClose }: TabBarProps) => {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#252526', // 탭 바 배경색
      height: '35px',
      overflowX: 'auto', // 탭이 많아지면 스크롤
      borderBottom: '1px solid #1e1e1e'
    }}>
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onSelect(file.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            minWidth: '120px',
            maxWidth: '200px',
            cursor: 'pointer',
            backgroundColor: file.id === activeId ? '#1e1e1e' : '#2d2d2d', // 활성 탭은 어둡게(에디터 색과 동일)
            color: file.id === activeId ? 'white' : '#969696',
            borderRight: '1px solid #1e1e1e',
            borderTop: file.id === activeId ? '1px solid #007acc' : '1px solid transparent', // 활성 탭 파란 줄
            fontSize: '13px',
            userSelect: 'none'
          }}
        >
          {/* 파일 아이콘 */}
          <span style={{ marginRight: '6px' }}>📄</span>
          
          {/* 파일 이름 */}
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </span>

          {/* 닫기 버튼 (x) */}
          <span 
            onClick={(e) => {
              e.stopPropagation(); // 탭 선택 이벤트 방지
              onClose(file.id);
            }}
            style={{
              marginLeft: '8px',
              fontSize: '14px',
              borderRadius: '3px',
              padding: '0 4px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4d4d4d'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            ×
          </span>
        </div>
      ))}
    </div>
  );
};

export default TabBar;