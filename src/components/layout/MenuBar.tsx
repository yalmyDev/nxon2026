import React, { useState, useEffect, useRef } from 'react';

interface MenuBarProps {
  onNewFile: () => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  userInfo: { empId: string; name: string };
  openLogoutModal: () => void; // 로그아웃 모달 여는 함수로 변경
}

export default function MenuBar({ onNewFile, onOpenFile, onOpenFolder, userInfo, openLogoutModal }: MenuBarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActiveCategory(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuData = [
    {
      label: '파일(F)',
      key: 'file',
      items: [
        { label: '새 텍스트 파일', action: onNewFile, shortcut: 'Ctrl+N' },
        { label: '파일 열기...', action: onOpenFile, shortcut: 'Ctrl+O' },
        { label: '폴더 열기...', action: onOpenFolder, shortcut: 'Ctrl+K Ctrl+O' },
        { type: 'separator' },
        { label: '로그아웃', action: openLogoutModal, color: '#ef5350' },
      ]
    },
    { label: '편집(E)', key: 'edit', items: [] },
    { label: '선택영역(S)', key: 'selection', items: [] },
    { label: '보기(V)', key: 'view', items: [] },
    { label: '도움말(H)', key: 'help', items: [] },
  ];

  return (
    <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '30px', backgroundColor: '#1e1e1e', color: '#ccc', fontSize: '13px', borderBottom: '1px solid #2b2b2b', zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ padding: '0 12px', color: '#007acc', fontWeight: 'bold' }}>VIBE</div>
        {menuData.map((cat) => (
          <div key={cat.key} style={{ position: 'relative' }}>
            <div 
              style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: activeCategory === cat.key ? '#333' : 'transparent' }}
              onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
              onMouseEnter={() => activeCategory && setActiveCategory(cat.key)}
            >
              {cat.label}
            </div>
            {activeCategory === cat.key && cat.items.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#252526', border: '1px solid #454545', minWidth: '200px', padding: '5px 0', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                {cat.items.map((item: any, i) => (
                  item.type === 'separator' ? <div key={i} style={{ height: '1px', backgroundColor: '#454545', margin: '4px 0' }} /> :
                  <div key={i} onClick={() => { item.action?.(); setActiveCategory(null); }} style={{ padding: '5px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: item.color || '#ccc' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#094771'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <span>{item.label}</span>
                    <span style={{ fontSize: '11px', opacity: 0.5 }}>{item.shortcut}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', paddingRight: '15px', gap: '10px' }}>
        <span style={{ fontSize: '11px', color: '#888' }}>{userInfo.name} ({userInfo.empId})</span>
        <button onClick={openLogoutModal} style={{ backgroundColor: 'transparent', border: '1px solid #444', color: '#ef5350', fontSize: '11px', padding: '2px 8px', cursor: 'pointer' }}>로그아웃</button>
      </div>
    </div>
  );
}