import React, { useState, useEffect, useRef } from 'react';

// ----------------------------------------------------------------------
// 1. 타입 정의 수정 (action 추가)
// ----------------------------------------------------------------------

type SeparatorItem = {
  type: 'separator';
};

type CommandItem = {
  type?: 'command';
  label: string;
  shortcut?: string;
  action?: string; // [수정 1] 어떤 기능을 실행할지 식별하기 위한 키 추가
};

type MenuItem = SeparatorItem | CommandItem;

type MenuCategory = {
  label: string;
  key: string;
  items: MenuItem[];
};

// [수정 2] 부모(App)로부터 받아올 함수들의 타입 정의
interface MenuBarProps {
  onNewFile: () => void;    // 새 파일 모달 띄우기용
  onOpenFile: () => void;   // 파일 열기용
  onOpenFolder: () => void; // 폴더 열기용
}

// ----------------------------------------------------------------------
// 2. 메뉴 데이터 수정 (action 매핑)
// ----------------------------------------------------------------------
const MENU_ITEMS: MenuCategory[] = [
  {
    label: '파일(F)',
    key: 'file',
    items: [
      // [수정 3] 각 메뉴에 맞는 action 이름 부여
      { label: '새 텍스트 파일', shortcut: 'Ctrl+N', action: 'new_file' },
      { label: '새 파일...', shortcut: 'Ctrl+Alt+Win+N', action: 'new_file' }, 
      { type: 'separator' },
      { label: '파일 열기...', shortcut: 'Ctrl+O', action: 'open_file' },
      { label: '폴더 열기...', shortcut: 'Ctrl+K Ctrl+O', action: 'open_folder' },
      { type: 'separator' },
      { label: '저장', shortcut: 'Ctrl+S', action: 'save' },
      { label: '모두 저장', shortcut: 'Ctrl+K S' },
      { type: 'separator' },
      { label: '종료', shortcut: 'Alt+F4' },
    ],
  },
  // ... (나머지 메뉴는 그대로 유지)
  {
    label: '편집(E)',
    key: 'edit',
    items: [
      { label: '실행 취소', shortcut: 'Ctrl+Z' },
      { label: '다시 실행', shortcut: 'Ctrl+Y' },
      { type: 'separator' },
      { label: '잘라내기', shortcut: 'Ctrl+X' },
      { label: '복사', shortcut: 'Ctrl+C' },
      { label: '붙여넣기', shortcut: 'Ctrl+V' },
    ],
  },
  {
    label: '선택영역(S)',
    key: 'selection',
    items: [
      { label: '모두 선택', shortcut: 'Ctrl+A' },
      { label: '선택 영역 확장', shortcut: 'Shift+Alt+Right' },
    ],
  },
  {
    label: '보기(V)',
    key: 'view',
    items: [
      { label: '명령 팔레트...', shortcut: 'Ctrl+Shift+P' },
      { label: '터미널', shortcut: 'Ctrl+`' },
    ],
  },
  { label: '이동(G)', key: 'go', items: [] },
  { label: '실행(R)', key: 'run', items: [] },
  {
    label: '터미널(T)',
    key: 'terminal',
    items: [{ label: '새 터미널', shortcut: 'Ctrl+Shift+`' }],
  },
  {
    label: '도움말(H)',
    key: 'help',
    items: [{ label: '시작하기' }],
  },
];

// ----------------------------------------------------------------------
// 3. 컴포넌트 구현
// ----------------------------------------------------------------------
// [수정 4] Props 받기 ({ onNewFile, ... })
const MenuBar = ({ onNewFile, onOpenFile, onOpenFolder }: MenuBarProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // [수정 5] 메뉴 클릭 핸들러 추가
  const handleMenuClick = (item: CommandItem) => {
    setActiveMenu(null); // 메뉴 닫기
    
    // action에 따라 부모 함수 실행
    if (item.action === 'new_file') {
      onNewFile();
    } else if (item.action === 'open_file') {
      onOpenFile();
    } else if (item.action === 'open_folder') {
      onOpenFolder();
    } else {
      console.log(`${item.label} 클릭됨 (기능 미구현)`);
    }
  };

  return (
    <div
      ref={menuRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '30px',
        backgroundColor: '#1e1e1e',
        color: '#cccccc',
        fontSize: '13px',
        userSelect: 'none',
        borderBottom: '1px solid #2b2b2b',
        zIndex: 50,
      }}
    >
      <div style={{ padding: '0 12px', marginRight: '4px' }}>
        <span style={{ color: '#007acc', fontWeight: 'bold' }}>VIBE</span>
      </div>

      {MENU_ITEMS.map((menu) => (
        <div key={menu.key} style={{ position: 'relative' }}>
          <div
            style={{
              padding: '5px 10px',
              cursor: 'pointer',
              backgroundColor: activeMenu === menu.key ? '#3c3c3c' : 'transparent',
              color: activeMenu === menu.key ? 'white' : '#cccccc',
              borderRadius: '3px',
            }}
            onClick={() => setActiveMenu(activeMenu === menu.key ? null : menu.key)}
            onMouseEnter={() => {
              if (activeMenu) setActiveMenu(menu.key);
            }}
          >
            {menu.label}
          </div>

          {activeMenu === menu.key && menu.items.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: '250px',
                backgroundColor: '#252526',
                border: '1px solid #454545',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                borderRadius: '4px',
                padding: '4px 0',
                zIndex: 100,
              }}
            >
              {menu.items.map((item, idx) => {
                if ('type' in item && item.type === 'separator') {
                  return (
                    <div
                      key={idx}
                      style={{
                        height: '1px',
                        backgroundColor: '#454545',
                        margin: '4px 8px',
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={idx}
                    className="menu-item"
                    // [수정 6] 클릭 시 handleMenuClick 호출
                    onClick={() => handleMenuClick(item as CommandItem)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#094771';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#cccccc';
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 24px 6px 12px',
                      cursor: 'pointer',
                      color: '#cccccc',
                    }}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span
                        style={{
                          marginLeft: '20px',
                          fontSize: '12px',
                          opacity: 0.7,
                        }}
                      >
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;