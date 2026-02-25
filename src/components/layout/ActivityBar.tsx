import React from 'react';

// 아이콘들의 Props 타입 정의
interface IconProps {
    stroke?: string;
}

interface ActivityBarProps {
    activeMenu: string;
    onMenuChange: (menu: string) => void;
}

export default function ActivityBar({ activeMenu, onMenuChange }: ActivityBarProps) {
  // 아이콘 컴포넌트를 직접 배열에 담습니다.
    const menus = [
        { id: 'explorer', title: 'Explorer', Icon: FolderIcon },
        { id: 'search', title: 'Search', Icon: SearchIcon },
        { id: 'scm', title: 'Source Control', Icon: SourceControlIcon },
        { id: 'debug', title: 'Run and Debug', Icon: DebugIcon },
        { id: 'ai-config', title: 'AI Modules', Icon: AIIcon },
    ];

    return (
        <aside className="sidemenu-bar">
        {menus.map((menu) => {
            // 배열에서 꺼낸 Icon을 대문자 변수에 할당하여 컴포넌트로 사용
            const MenuIcon = menu.Icon;
            const isActive = activeMenu === menu.id;

            return (
            <div 
                key={menu.id}
                className={`icon ${isActive ? 'active' : ''}`}
                onClick={() => onMenuChange(menu.id)}
                title={menu.title}
            >
                {/* 여기서 직접 stroke 값을 넘겨줍니다 */}
                <MenuIcon stroke={isActive ? "#fff" : "#888"} />
            </div>
            );
        })}
        </aside>
    );
}

// --- 아이콘 컴포넌트들 (IconProps를 인자로 받음) ---

const FolderIcon = ({ stroke }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <path d="M4 9C4 7.11438 4 6.17157 4.58579 5.58579C5.17157 5 6.11438 5 8 5H8.34315C9.16065 5 9.5694 5 9.93694 5.15224C10.3045 5.30448 10.5935 5.59351 11.1716 6.17157L11.8284 6.82843C12.4065 7.40649 12.6955 7.69552 13.0631 7.84776C13.4306 8 13.8394 8 14.6569 8H16C17.8856 8 18.8284 8 19.4142 8.58579C20 9.17157 20 10.1144 20 12V15C20 16.8856 20 17.8284 19.4142 18.4142C18.8284 19 17.8856 19 16 19H8C6.11438 19 5.17157 19 4.58579 18.4142C4 17.8284 4 16.8856 4 15V9Z" />
    </svg>
);

const SearchIcon = ({ stroke }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20L17 17" strokeLinecap="round" />
    </svg>
);

const SourceControlIcon = ({ stroke }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9v1a2 2 0 0 1-2 2H8" />
        <path d="M6 15V6a2 2 0 0 1 2-2h1" />
    </svg>
);

const DebugIcon = ({ stroke }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <path d="M8 5v14l11-7z" strokeLinejoin="round" />
    </svg>
);

const AIIcon = ({ stroke }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <path d="M12 2.5C13.0892 2.5 14.2097 3.39607 15.0879 5.15234C15.9512 6.87893 16.5 9.29937 16.5 12C16.5 14.7006 15.9512 17.1211 15.0879 18.8477C14.2097 20.6039 13.0892 21.5 12 21.5C10.9108 21.5 9.79033 20.6039 8.91211 18.8477C8.04882 17.1211 7.5 14.7006 7.5 12C7.5 9.29937 8.04882 6.87893 8.91211 5.15234C9.79033 3.39607 10.9108 2.5 12 2.5Z" />
        <path d="M20.2273 7.24987C20.7719 8.19317 20.5561 9.61153 19.4742 11.2502C18.4106 12.8612 16.5888 14.5467 14.25 15.897C11.9112 17.2473 9.54064 17.9822 7.61373 18.0979C5.65364 18.2155 4.3174 17.6932 3.77278 16.7499C3.22817 15.8066 3.44397 14.3882 4.52583 12.7495C5.58945 11.1386 7.41121 9.45307 9.75002 8.10275C12.0888 6.75244 14.4594 6.01751 16.3863 5.90185C18.3464 5.78427 19.6827 6.30656 20.2273 7.24987Z" />
        <path d="M20.2273 16.75C20.7719 15.8067 20.5561 14.3883 19.4742 12.7496C18.4106 11.1387 16.5888 9.45315 14.25 8.10284C11.9112 6.75252 9.54064 6.01759 7.61373 5.90193C5.65364 5.78436 4.3174 6.30665 3.77278 7.24995C3.22817 8.19325 3.44397 9.61162 4.52583 11.2503C5.58945 12.8612 7.41121 14.5467 9.75002 15.8971C12.0888 17.2474 14.4594 17.9823 16.3863 18.098C18.3464 18.2155 19.6827 17.6933 20.2273 16.75Z" />
    </svg>
);